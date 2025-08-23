import {
  contentHashFromArrayBuffer,
  Entry,
  EntryId,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId
} from '@convex-dev/rag';
import { paginationOptsValidator, PaginationResult } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { Id } from '../_generated/dataModel';
import { action, query, QueryCtx } from '../_generated/server';
import { extractTextContent } from '../lib/extractTextContent';
import { rag } from '../system/ai/rag';

type EntryMetadata = {
  storageId: Id<'_storage'>;
  uploadedBy: string;
  fileName: string;
  category: string;
};

const getMimeType = (filename: string, bytes: ArrayBuffer): string => {
  return (
    guessMimeTypeFromExtension(filename) ||
    guessMimeTypeFromContents(bytes) ||
    'application/octet-stream'
  );
};

export const addFile = action({
  args: {
    fileName: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const { bytes, category, fileName } = args;
    const mimeType = args.mimeType || getMimeType(fileName, bytes);
    const blob = new Blob([bytes], { type: mimeType });

    // store file to storage
    const storageId = await ctx.storage.store(blob);

    const text = await extractTextContent(ctx, {
      storageId,
      fileName,
      bytes,
      mimeType
    });

    // Create an embedding for the file and add it to the RAG store
    const { entryId, created } = await rag.add(ctx, {
      namespace: identity.orgId.toString(), // Use namespaces for user-specific or team-specific data to isolate search domains.
      text,
      key: fileName,
      title: fileName,
      metadata: {
        storageId,
        fileName,
        uploadedBy: identity.orgId,
        category: category ?? 'Other'
      } as EntryMetadata,
      contentHash: await contentHashFromArrayBuffer(bytes) // avoid re-adding the same file
    });

    if (!created) {
      console.warn(`entry already exists: ${entryId}, skipping...`);
      await ctx.storage.delete(storageId);
    }

    return {
      fileUrl: await ctx.storage.getUrl(storageId),
      entryId
    };
  }
});

export const deleteFile = action({
  args: {
    entryId: vEntryId
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const { entryId } = args;

    const namespace = await rag.getNamespace(ctx, {
      namespace: identity.orgId.toString()
    });

    if (!namespace) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const entry = await rag.getEntry(ctx, {
      entryId
    });

    if (!entry) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Entry not found'
      });
    }

    if (entry.metadata?.uploadedBy !== identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    if (!entry.metadata.storageId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Storage ID not found'
      });
    }

    await ctx.storage.delete(entry.metadata.storageId as Id<'_storage'>);

    await rag.deleteAsync(ctx, {
      entryId
    });
  }
});

export const getFiles = query({
  args: {
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const namespace = await rag.getNamespace(ctx, {
      namespace: identity.orgId.toString()
    });

    if (!namespace) {
      return {
        page: [],
        isDone: true,
        continueCursor: ''
      };
    }

    const results = await rag.list(ctx, {
      namespaceId: namespace.namespaceId,
      paginationOpts: args.paginationOpts
    });

    const getFileReqs = results.page.map((result) => {
      return convertEntryToPublicFile(ctx, result);
    });

    const files = await Promise.all(getFileReqs);

    const filteredFiles = files.filter((file) => {
      if (args.category) {
        return file.category === args.category;
      }
      return true;
    });

    return {
      page: filteredFiles,
      isDone: results.isDone,
      continueCursor: results.continueCursor
    };
  }
});

export type PublicFile = {
  id: EntryId;
  name: string;
  type: string;
  size: string;
  status: 'ready' | 'processing' | 'error';
  url: string | null;
  category: string;
};

const formatFileSize = (size: number): string => {
  if (size === 0) {
    return '0 B';
  }
  const K = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(size) / Math.log(K));
  return `${Number.parseFloat((size / K ** i).toFixed(1))} ${sizes[i]}`;
};

const convertEntryToPublicFile = async (
  ctx: QueryCtx,
  entry: Entry
): Promise<PublicFile> => {
  const metadata = entry.metadata as EntryMetadata | undefined;
  const storageId = metadata?.storageId;

  let fileSize = 'Unknown';

  if (storageId) {
    try {
      const storageMetadata = await ctx.db.system.get(storageId);
      if (storageMetadata) {
        fileSize = formatFileSize(storageMetadata.size);
      }
    } catch (error) {
      console.error('Error getting storage metadata', error);
    }
  }

  const fileName = entry.key ?? 'Unknown';
  const fileExtension = fileName.split('.').pop()?.toLowerCase() ?? 'txt';

  let status: 'ready' | 'processing' | 'error' = 'error';

  if (entry.status === 'ready') {
    status = 'ready';
  } else if (entry.status === 'pending') {
    status = 'processing';
  }

  const url = storageId ? await ctx.storage.getUrl(storageId) : null;

  return {
    id: entry.entryId,
    name: fileName,
    type: fileExtension,
    size: fileSize,
    status,
    url,
    category: metadata?.category ?? 'Other'
  };
};
