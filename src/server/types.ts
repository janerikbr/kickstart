import type { ViteDevServer } from "vite";

declare module "fastify" {
  interface FastifyInstance {
    vite?: ViteDevServer;
  }
}
