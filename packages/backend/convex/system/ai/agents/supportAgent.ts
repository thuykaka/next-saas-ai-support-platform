import { Agent } from '@convex-dev/agent';
import { openai } from '@ai-sdk/openai';
import { components } from '../../../_generated/api';

const supportAgent = new Agent(components.agent, {
  name: 'Support Agent',
  chat: openai.chat('gpt-4o-mini'),
  instructions:
    'You are customer support agent. You are responsible for answering questions and helping customers with their issues.'
});

export default supportAgent;
