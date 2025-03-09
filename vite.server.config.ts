import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { createRequire } from "module";
import path from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

/**
 * Server-side Vite configuration file
 *
 * This configuration is ONLY used for building server-side code for production:
 * - When running: pnpm build:server (vite build --ssr --config vite.server.config.ts)
 * - NOT used during development
 *
 * Key features:
 * - Enables SSR-specific build options
 * - Targets Node.js runtime
 * - Configures server entry points
 * - Preserves predictable output filenames for server modules
 * - Ensures proper Node.js module resolution
 * - Processes Vanilla Extract styles for consistent class names with client
 */
export default defineConfig({
  plugins: [
    preact({
      babel: {
        cwd: createRequire(import.meta.url).resolve("@preact/preset-vite"),
      },
    }),
    vanillaExtractPlugin(), // Add Vanilla Extract plugin
  ],
  build: {
    ssr: true,
    target: "node22",
    outDir: "dist/server",
    rollupOptions: {
      input: {
        server: path.resolve(__dirname, "src/server/server.ts"),
        "entry-server": path.resolve(__dirname, "src/server/entry-server.tsx"),
      },
      output: {
        format: "esm",
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
  },
});
