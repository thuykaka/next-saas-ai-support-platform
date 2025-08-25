import { createTool } from '@convex-dev/agent';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod/v3';
import { internal } from '../../_generated/api';
import supportAgent from './agents/supportAgent';
import { SEARCH_INTERPRETER_PROMPT } from './constants';
import { rag } from './rag';

export const searchTool = createTool({
  description:
    "Search the knowledge base for relevant information to help answer user's question",
  args: z.object({
    query: z.string().describe('The query to search the knowledge base for')
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      throw new Error('No thread found');
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: ctx.threadId
      }
    );

    if (!conversation) {
      return 'Conversation not found';
    }

    const orgId = conversation.orgId;

    /* searchResult format:
    ## Title 1:
    Chunk 1 contents
    Chunk 2 contents
    */
    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5
    });

    const titles = (searchResult.entries ?? [])
      .map((entry) => entry.title)
      .filter(Boolean);

    const kbText = (searchResult.text ?? '').trim();

    // If nothing was found, obey the prompt contract without invoking the model.
    if (titles.length === 0 || kbText.length === 0) {
      const content =
        "I couldn't find specific information about that in our knowledge base. Would you like me to connect you with a human support agent who can help?";
      await supportAgent.saveMessage(ctx, {
        threadId: ctx.threadId,
        message: {
          role: 'assistant',
          content
        }
      });
      return content;
    }

    const contextText = `Found results in ${titles.join(', ')}. Here is the context:\n\n${kbText}`;
    const response = await generateText({
      model: openai.chat('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: SEARCH_INTERPRETER_PROMPT
        },
        {
          role: 'user',
          content: `User question: ${args.query}\n\nKnowledge base search results: ${contextText}`
        }
      ]
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: 'assistant',
        content: response.text
      }
    });

    return response.text;
  }
});
