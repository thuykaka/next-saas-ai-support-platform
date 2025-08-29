export const INTEGRATIONS = [
  {
    id: 'html',
    title: 'HTML',
    icon: '/languages/html5.svg'
  },
  {
    id: 'react',
    title: 'React',
    icon: '/languages/react.svg'
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    icon: '/languages/nextjs.svg'
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    icon: '/languages/javascript.svg'
  }
] as const;

export type IntegrationId = (typeof INTEGRATIONS)[number]['id'];

const WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL || 'http://localhost:3001/echo-widget.js';

export const HTML_SNIPPET = `<script src='${WIDGET_URL}' data-org-id='__ORG_ID__' defer></script>`;
export const REACT_SNIPPET = `<script src='${WIDGET_URL}' data-org-id='__ORG_ID__' defer></script>`;
export const NEXTJS_SNIPPET = `<script src='${WIDGET_URL}' data-org-id='__ORG_ID__' defer></script>`;
export const JAVASCRIPT_SNIPPET = `<script src='${WIDGET_URL}' data-org-id='__ORG_ID__' defer></script>`;
