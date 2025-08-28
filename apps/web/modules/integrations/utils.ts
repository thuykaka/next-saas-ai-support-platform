import {
  HTML_SNIPPET,
  JAVASCRIPT_SNIPPET,
  NEXTJS_SNIPPET,
  REACT_SNIPPET
} from './constants';
import { IntegrationId } from './constants';

export const createSnippet = (integrationId: IntegrationId, orgId: string) => {
  if (integrationId === 'html') {
    return HTML_SNIPPET.replaceAll('__ORG_ID__', orgId);
  }

  if (integrationId === 'react') {
    return REACT_SNIPPET.replaceAll('__ORG_ID__', orgId);
  }

  if (integrationId === 'nextjs') {
    return NEXTJS_SNIPPET.replaceAll('__ORG_ID__', orgId);
  }

  if (integrationId === 'javascript') {
    return JAVASCRIPT_SNIPPET.replaceAll('__ORG_ID__', orgId);
  }

  return '';
};
