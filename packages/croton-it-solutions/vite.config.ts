import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@croton": path.resolve(import.meta.dirname, "./src"),
      "@croton/*": path.resolve(import.meta.dirname, "./src/*"),
      "@talent-flow/api": path.resolve(import.meta.dirname, "../api/src/index.ts"),
      "@talent-flow/api/*": path.resolve(import.meta.dirname, "../api/src/*"),
      "@talent-flow/candidate-portal": path.resolve(
        import.meta.dirname,
        "../candidate-portal/src/App.tsx",
      ),
      "@talent-flow/company-onboarding": path.resolve(
        import.meta.dirname,
        "../company-onboarding/src/App.tsx",
      ),
      "@talent-flow/admin-panel": path.resolve(
        import.meta.dirname,
        "../admin-panel/src/components/AdminPanelContainer.tsx",
      ),
    },
  },
  envDir: path.resolve(import.meta.dirname, "../../"),
  server: {
    port: Number(process.env.VITE_PORT || process.env.PORT || 3000),
    host: true,
  },
});
