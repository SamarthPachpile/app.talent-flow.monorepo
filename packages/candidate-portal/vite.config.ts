import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "../../");
  const env = loadEnv(mode, envDir, "");
  const portStr =
    env.VITE_PORT_CANDIDATE_PORTAL || env.VITE_CANDIDATES_PORT || env.VITE_PORT || env.PORT;

  if (!portStr) {
    throw new Error("Port for candidate-portal must be specified in the .env file!");
  }

  return {
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@candidate-portal": path.resolve(__dirname, "./src"),
        "@candidate": path.resolve(__dirname, "./src"),
        "@talent-flow/candidate-portal": path.resolve(__dirname, "./src/App.tsx"),
        "@talent-flow/api": path.resolve(__dirname, "../api/src/index.ts"),
        "@api": path.resolve(__dirname, "../api/src/index.ts"),
      },
    },
    envDir,
    server: {
      port: Number(portStr),
      host: true,
      open: false,
    },
  };
});
