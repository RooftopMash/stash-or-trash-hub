// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * Production code protection & console-stripping plugin:
 * - Strips console.log / console.debug / console.info / console.trace / debugger statements in production client bundles
 * - Strips source-location attributes (data-tsd-source, data-lov-id) so internal file paths never appear in the DOM
 */
function sotProductionShieldPlugin(): Plugin {
  let isBuild = false;
  return {
    name: "sot-production-shield",
    enforce: "post",
    configResolved(resolved) {
      isBuild = resolved.command === "build";
    },
    transform(code, id) {
      if (!isBuild) return null;
      if (id.includes("node_modules")) return null;
      if (!/\.[cm]?[jt]sx?$/.test(id)) return null;

      let transformed = code
        .replace(/\bdebugger\s*;?/g, "")
        .replace(
          /\bconsole\.(log|debug|info|trace|table|dir)\s*\([^;]*?\)\s*;?/g,
          "void 0;",
        );

      if (transformed !== code) {
        return { code: transformed, map: null };
      }
      return null;
    },
  };
}

export default defineConfig({
  react: {
    jsxRuntime: "automatic",
  },
  nitro:
    process.env.VERCEL || process.env.NOW_BUILDER
      ? {
          preset: "vercel",
          vercel: {
            functions: {
              runtime: "nodejs20.x",
            },
          },
        }
      : process.env.NITRO_PRESET
        ? { preset: process.env.NITRO_PRESET }
        : undefined,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    envPrefix: ["VITE_"],
    plugins: [sotProductionShieldPlugin()],
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    esbuild: {
      drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
      legalComments: "none",
    },
    build: {
      sourcemap: false,
      minify: true,
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        output: {
          entryFileNames: "assets/[hash].js",
          chunkFileNames: "assets/[hash].js",
          assetFileNames: "assets/[hash][extname]",
        },
        onwarn(warning, warn) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            warning.message?.includes("MODULE_LEVEL_DIRECTIVE") ||
            warning.message?.includes('"use client"')
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        process.env.VITE_SUPABASE_URL ||
          process.env.SUPABASE_URL ||
          "https://ypbyouaddkdfuhfpnguu.supabase.co",
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_ANON_KEY ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwYnlvdWFkZGtkZnVoZnBuZ3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1OTY0OTgsImV4cCI6MjA5OTE3MjQ5OH0.IEHBd2gZuTpIvedgDPpytWxeoDUglcWIsZctl5Z9TvI",
      ),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(
        process.env.VITE_SUPABASE_PROJECT_ID ||
          process.env.SUPABASE_PROJECT_ID ||
          "ypbyouaddkdfuhfpnguu",
      ),
    },
  },
});
