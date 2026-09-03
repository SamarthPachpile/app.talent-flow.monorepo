import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "../../");
  const env = loadEnv(mode, envDir, "");
  const portStr =
    env.VITE_PORT_GRAVITON_IT_SOLUTIONS || env.VITE_GRAVITON_PORT || env.VITE_PORT || "3000";

  return {
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@graviton": path.resolve(__dirname, "./src"),
        "@graviton-it-solutions": path.resolve(__dirname, "./src"),
        "@talent-flow/graviton-it-solutions": path.resolve(__dirname, "./src/App.tsx"),
        "@talent-flow/graviton-it-solutions-client": path.resolve(__dirname, "./src/App.tsx"),
        "@talent-flow/graviton-it-solutions-api": path.resolve(
          __dirname,
          "../api/src/client/index.ts",
        ),
        "@talent-flow/api": path.resolve(__dirname, "../api/src/client/index.ts"),
        "@talent-flow/schema-types": path.resolve(__dirname, "../schema-types/src/index.ts"),
        "@talent-flow/utilities": path.resolve(__dirname, "../utilities/src/index.ts"),
        "@api": path.resolve(__dirname, "../api/src/client/index.ts"),
        "@talent-flow/admin-panel": path.resolve(
          __dirname,
          "../admin-panel/src/components/AdminPanelContainer.tsx",
        ),
        "@admin-panel": path.resolve(__dirname, "../admin-panel/src"),
        "@talent-flow/company-portal": path.resolve(__dirname, "../company-portal/src/App.tsx"),
        "@talent-flow/company-onboarding": path.resolve(__dirname, "../company-portal/src/App.tsx"),
        "@company-onboarding": path.resolve(__dirname, "../company-portal/src"),
        "@talent-flow/candidate-portal": path.resolve(__dirname, "../candidate-portal/src/App.tsx"),
        "@candidate-portal": path.resolve(__dirname, "../candidate-portal/src"),
      },
    },
    envDir,
    server: {
      port: Number(portStr),
      host: true,
      open: false,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
