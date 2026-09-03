import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const envDir = path.resolve(__dirname, "../../");
  const env = loadEnv(mode || "development", envDir, "");
  const portStr = env.VITE_PORT_ADMIN_PANEL || env.VITE_ADMIN_PORT || env.VITE_PORT || "3001";

  const plugins = [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    react(),
  ];

  if (command === "build") {
    plugins.push(nitro());
  }

  return {
    plugins,
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
    resolve: {
      alias: {
        "punycode/": "punycode",
        "@": path.resolve(__dirname, "./src"),
        "@admin-panel": path.resolve(__dirname, "./src"),
        "@admin": path.resolve(__dirname, "./src"),
        "@talent-flow/admin-panel": path.resolve(
          __dirname,
          "./src/components/AdminPanelContainer.tsx",
        ),
        "@talent-flow/admin-panel-client": path.resolve(
          __dirname,
          "./src/components/AdminPanelContainer.tsx",
        ),
        "@talent-flow/admin-panel-api": path.resolve(__dirname, "../api/src/client/index.ts"),
        "@talent-flow/api": path.resolve(__dirname, "../api/src/client/index.ts"),
        "@talent-flow/schema-types": path.resolve(__dirname, "../schema-types/src/index.ts"),
        "@talent-flow/utilities": path.resolve(__dirname, "../utilities/src/index.ts"),
        "@api": path.resolve(__dirname, "../api/src/client/index.ts"),
        "@talent-flow/candidate-portal": path.resolve(__dirname, "../candidate-portal/src/App.tsx"),
        "@talent-flow/company-portal": path.resolve(__dirname, "../company-portal/src/App.tsx"),
        "@talent-flow/company-onboarding": path.resolve(__dirname, "../company-portal/src/App.tsx"),
        "@talent-flow/graviton-it-solutions": path.resolve(
          __dirname,
          "../graviton-it-solutions/src/App.tsx",
        ),
      },
    },
  };
});
