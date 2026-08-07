// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    envDir: path.resolve(__dirname, "../../"),
    resolve: {
      alias: {
        "@talent-flow/api": path.resolve(__dirname, "../api/src/index.ts"),
        "@talent-flow/api/*": path.resolve(__dirname, "../api/src/*"),
        "@talent-flow/candidate-portal": path.resolve(__dirname, "../candidate-portal/src/App.tsx"),
        "@talent-flow/company-onboarding": path.resolve(
          __dirname,
          "../company-onboarding/src/App.tsx",
        ),
      },
    },
  },
});
