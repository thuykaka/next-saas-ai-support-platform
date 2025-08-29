FROM node:22-alpine AS base
# enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN pnpm global add turbo@^2
RUN pnpm add -g turbo@^2.4.2
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Prune the widget workspace specifically
RUN turbo prune widget --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
 
# Build the project
COPY --from=builder /app/out/full/ .

# Add output: 'standalone' to next.config.mjs for Docker build
RUN sed -i "s/transpilePackages: \['@workspace\/ui'\]/transpilePackages: ['@workspace\/ui'],\n  output: 'standalone',/" apps/widget/next.config.mjs

RUN pnpm turbo run build
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/widget/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/widget/.next/static ./apps/widget/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/widget/public ./apps/widget/public
 
EXPOSE 3001

ENV PORT=3001

ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/widget/server.js"]