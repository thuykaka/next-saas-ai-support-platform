import { Agent } from '@convex-dev/agent';
import { openai } from '@ai-sdk/openai';
import { components } from '../../../_generated/api';
import { SUPPORT_AGENT_PROMPT } from '../../../constants';

const supportAgent = new Agent(components.agent, {
  name: 'Support Agent',
  chat: openai.chat('gpt-4o-mini'),
  instructions: SUPPORT_AGENT_PROMPT
});

export default supportAgent;
