import type { StorageActionWriter } from 'convex/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { Id } from '../_generated/dataModel';

const AI_MODELS = {
  image: openai.chat('gpt-4o-mini'),
  pdf: openai.chat('gpt-4o'),
  html: openai.chat('gpt-4o')
} as const;

const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp'
] as const;

const SYSTEM_PROMPT = {
  image: `You are an expert in extracting text from images. You will be given an image, if it is a image of a document, you will need to extract the text from the image. Otherwise, describe the image in detail.`,
  pdf: `You are an expert in extracting text from pdfs. You will be given a pdf and you will need to extract the text from the pdf.`,
  html: `You are an expert in extracting text from html and convert it to markdown. You will be given an html and you will need to extract the text from the html and convert it to markdown.`
};

export type ExtractTextContentArgs = {
  storageId: Id<'_storage'>;
  fileName: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

const extractTextFromImage = async (fileUrl: string): Promise<string> => {
  const response = await generateText({
    model: AI_MODELS.image,
    prompt: SYSTEM_PROMPT.image,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: new URL(fileUrl)
          }
        ]
      }
    ]
  });

  return response.text;
};

const extractTextFromPdf = async (
  fileUrl: string,
  fileName: string,
  mimeType: string
): Promise<string> => {
  const response = await generateText({
    model: AI_MODELS.pdf,
    prompt: SYSTEM_PROMPT.pdf,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            data: new URL(fileUrl),
            mimeType,
            filename: fileName
          },
          {
            type: 'text',
            text: 'Extract the text from the pdf and print it without any explanation.'
          }
        ]
      }
    ]
  });

  return response.text;
};

const extractTextFromFileContent = async (
  ctx: { storage: StorageActionWriter },
  storageId: Id<'_storage'>,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> => {
  const arrayBuffer =
    bytes ?? (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error('File not found');
  }

  // extract text from buffer
  const text = new TextDecoder().decode(arrayBuffer);

  if (mimeType.toLocaleLowerCase() !== 'text/plain') {
    const response = await generateText({
      model: AI_MODELS.html,
      prompt: SYSTEM_PROMPT.html,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text },
            {
              type: 'text',
              text: 'Extract the text and convert it to markdown. Do not include any other text or explanation. Do not include any other text or explanation.'
            }
          ]
        }
      ]
    });

    return response.text;
  }

  return text;
};

export const extractTextContent = async (
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> => {
  const { storageId, fileName, bytes, mimeType } = args;

  const fileUrl = await ctx.storage.getUrl(storageId);

  if (!fileUrl) {
    throw new Error('File not found');
  }

  if (SUPPORTED_IMAGE_MIME_TYPES.some((type) => mimeType === type)) {
    return extractTextFromImage(fileUrl);
  }

  if (mimeType.startsWith('application/pdf')) {
    return extractTextFromPdf(fileUrl, fileName, mimeType);
  }

  if (mimeType.includes('text')) {
    return extractTextFromFileContent(ctx, storageId, bytes, mimeType);
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
};
