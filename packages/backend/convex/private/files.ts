import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId
} from '@convex-dev/rag';
import { ConvexError, v } from 'convex/values';
import { Id } from '../_generated/dataModel';
import { action } from '../_generated/server';
import { extractTextContent } from '../lib/extractTextContent';
import { rag } from '../system/ai/rag';

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
        uploadedBy: identity.orgId,
        category: category ?? 'Other'
      },
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
