import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(import.meta.dirname, "../../");
  const env = loadEnv(mode, envDir, "");
  const portStr =
    env.VITE_PORT_GRAVITON_IT_SOLUTIONS || env.VITE_GRAVITON_PORT || env.VITE_PORT || env.PORT;

  if (!portStr) {
    throw new Error("Port for graviton-it-solutions must be specified in the .env file!");
  }

  return {
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@graviton": path.resolve(import.meta.dirname, "./src"),
        "@graviton-it-solutions": path.resolve(import.meta.dirname, "./src"),
        "@talent-flow/graviton-it-solutions": path.resolve(import.meta.dirname, "./src"),
        "@talent-flow/api": path.resolve(import.meta.dirname, "../api/src/index.ts"),
        "@api": path.resolve(import.meta.dirname, "../api/src/index.ts"),
        "@talent-flow/admin-panel": path.resolve(
          import.meta.dirname,
          "../admin-panel/src/components/AdminPanelContainer.tsx",
        ),
        "@admin-panel": path.resolve(import.meta.dirname, "../admin-panel/src"),
        "@talent-flow/company-onboarding": path.resolve(
          import.meta.dirname,
          "../company-onboarding/src/App.tsx",
        ),
        "@company-onboarding": path.resolve(import.meta.dirname, "../company-onboarding/src"),
        "@talent-flow/candidate-portal": path.resolve(
          import.meta.dirname,
          "../candidate-portal/src/App.tsx",
        ),
        "@candidate-portal": path.resolve(import.meta.dirname, "../candidate-portal/src"),
      },
    },
    envDir,
    server: {
      port: Number(portStr),
      host: true,
      open: true,
    },
  };
});
