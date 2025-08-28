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

export const HTML_SNIPPET = `<script src='http://localhost:3001/echo-widget.js' data-org-id='__ORG_ID__'></script>`;
export const REACT_SNIPPET = `<script src='http://localhost:3001/echo-widget.js' data-org-id='__ORG_ID__'></script>`;
export const NEXTJS_SNIPPET = `<script src='http://localhost:3001/echo-widget.js' data-org-id='__ORG_ID__'></script>`;
export const JAVASCRIPT_SNIPPET = `<script src='http://localhost:3001/echo-widget.js' data-org-id='__ORG_ID__'></script>`;
