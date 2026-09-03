import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "../../");
  const env = loadEnv(mode, envDir, "");
  const portStr =
    env.VITE_PORT_CANDIDATE_PORTAL || env.VITE_CANDIDATES_PORT || env.VITE_PORT || "3003";

  return {
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@candidate-portal": path.resolve(__dirname, "./src"),
        "@candidate": path.resolve(__dirname, "./src"),
        "@talent-flow/candidate-portal": path.resolve(__dirname, "./src/App.tsx"),
        "@talent-flow/candidate-portal-client": path.resolve(__dirname, "./src/App.tsx"),
        "@talent-flow/candidate-portal-api": path.resolve(__dirname, "../api/src/client/index.ts"),
        "@talent-flow/api": path.resolve(__dirname, "../api/src/client/index.ts"),
        "@talent-flow/schema-types": path.resolve(__dirname, "../schema-types/src/index.ts"),
        "@talent-flow/utilities": path.resolve(__dirname, "../utilities/src/index.ts"),
        "@api": path.resolve(__dirname, "../api/src/client/index.ts"),
        "@graviton": path.resolve(__dirname, "../graviton-it-solutions/src"),
        "@graviton-it-solutions": path.resolve(__dirname, "../graviton-it-solutions/src"),
        "@talent-flow/graviton-it-solutions": path.resolve(
          __dirname,
          "../graviton-it-solutions/src/App.tsx",
        ),
        "@talent-flow/admin-panel": path.resolve(
          __dirname,
          "../admin-panel/src/components/AdminPanelContainer.tsx",
        ),
        "@talent-flow/company-portal": path.resolve(__dirname, "../company-portal/src/App.tsx"),
        "@talent-flow/company-onboarding": path.resolve(__dirname, "../company-portal/src/App.tsx"),
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
