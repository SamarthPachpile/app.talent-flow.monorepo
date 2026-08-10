// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "path";

const envDir = path.resolve(import.meta.dirname, "../../");
const env = loadEnv(process.env.NODE_ENV || "development", envDir, "");
const portStr = env.VITE_PORT_ADMIN_PANEL || env.VITE_ADMIN_PORT || env.VITE_PORT || env.PORT;

if (!portStr) {
  throw new Error("Port for admin-panel must be specified in the .env file!");
}

export default defineLovableConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    envDir,
    server: {
      port: Number(portStr),
      host: true,
      open: false,
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@admin-panel": path.resolve(import.meta.dirname, "./src"),
        "@admin": path.resolve(import.meta.dirname, "./src"),
        "@talent-flow/admin-panel": path.resolve(
          import.meta.dirname,
          "./src/components/AdminPanelContainer.tsx",
        ),
        "@talent-flow/api": path.resolve(import.meta.dirname, "../api/src/index.ts"),
        "@api": path.resolve(import.meta.dirname, "../api/src/index.ts"),
      },
    },
  },
});
