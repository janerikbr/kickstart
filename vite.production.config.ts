import path from "node:path";

import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), preact()],
  build: {
    manifest: true,
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
