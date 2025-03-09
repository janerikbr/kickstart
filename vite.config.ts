import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { createRequire } from "module";
import devServer from "@hono/vite-dev-server";
import path from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

/**
 * Main Vite configuration file
 *
 * This configuration is used in two scenarios:
 * 1. During development (pnpm dev) - Controls the dev server with HMR
 * 2. For client-side production builds (pnpm build:client)
 *
 * Key features:
 * - Integrates Preact for UI components
 * - Uses @hono/vite-dev-server to connect Hono with Vite's dev server
 * - Configures client-side build options with proper asset fingerprinting
 * - Generates a manifest file for SSR asset references
 */
export default defineConfig({
  plugins: [
    preact({
      babel: {
        cwd: createRequire(import.meta.url).resolve("@preact/preset-vite"),
      },
    }),
    vanillaExtractPlugin(),
    // Hono dev server integration
    devServer({
      entry: "./src/server/server.ts",
    }),
  ],
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // This is critical
        home: "src/pages/home/client.tsx",
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
});
