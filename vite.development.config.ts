import { resolve } from "node:path";

import preact from "@preact/preset-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { createRequire } from "module";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "custom",
  root: process.cwd(), // Explicitly set the root to current directory
  publicDir: resolve(process.cwd(), "public"),
  server: {
    middlewareMode: true,
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    preact({
      babel: {
        cwd: createRequire(import.meta.url).resolve("@preact/preset-vite"),
      },
    }),
    vanillaExtractPlugin({
      unstable_mode: "transform",
    }),
  ],
  // Make sure entry points are properly resolved
  resolve: {
    alias: {
      src: resolve(process.cwd(), "src"),
    },
  },
});
