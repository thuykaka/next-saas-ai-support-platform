import agent from '@convex-dev/agent/convex.config';
import rag from '@convex-dev/rag/convex.config';
import { defineApp } from 'convex/server';

const app = defineApp();
app.use(agent);
app.use(rag);

export default app;
