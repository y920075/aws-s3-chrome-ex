import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
  },
  build: {
    target: "es2022",
    minify: false,
    rollupOptions: {
      input: [
        "./index.html",
        "./src/scripts/content.ts",
        "./src/scripts/background.ts",
      ],
      output: {
        format: "esm",
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === "background" || chunkInfo.name === "content") {
            return `[name].js`;
          }
          return `assets/[name].[hash].js`;
        },
      },
    },
  },
});
