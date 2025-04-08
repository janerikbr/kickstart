import path from "node:path";

import preact from "@preact/preset-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { createRequire } from "module";
import { defineConfig } from "vite";

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
