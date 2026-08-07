import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@talent-flow/api": path.resolve(__dirname, "../api/src/index.ts"),
      "@talent-flow/api/*": path.resolve(__dirname, "../api/src/*"),
    },
  },
  envDir: path.resolve(__dirname, "../../"),
  server: {
    port: Number(process.env.VITE_PORT || process.env.PORT || 3000),
    host: true,
  },
});
