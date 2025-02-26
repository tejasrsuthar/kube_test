FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

#RUN corepack enable
RUN npm install -g corepack@latest
# Install curl and clean up unnecessary files to reduce image size
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
# RUN pnpm --version

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# expose port
EXPOSE 3000

# start the application
CMD ["pnpm", "start"]

