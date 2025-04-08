import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "custom",
  server: {
    middlewareMode: true,
    hmr: true,
  },
  plugins: [tailwindcss(), preact()],
});
