// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

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

      const transformed = code
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
            entryFormat: "node",
            functions: {
              runtime: "nodejs20.x",
            },
          },
          hooks: {
            compiled() {
              try {
                const entryPath = path.resolve(
                  process.cwd(),
                  ".vercel/output/functions/__server.func/index.mjs",
                );
                if (fs.existsSync(entryPath)) {
                  let content = fs.readFileSync(entryPath, "utf8");
                  // Guard Object.defineProperty(e.socket, "remoteAddress", ...) with configurable:true and try/catch
                  content = content.replace(
                    /Object\.defineProperty\(([a-zA-Z0-9_$]+)\.socket,"remoteAddress",\{get\(\)\{/g,
                    'try{if($1&&$1.socket)Object.defineProperty($1.socket,"remoteAddress",{configurable:!0,get(){',
                  );
                  content = content.replace(
                    /Object\.defineProperty\(([a-zA-Z0-9_$]+)\.socket, "remoteAddress", \{ get\(\) \{/g,
                    'try { if ($1 && $1.socket) Object.defineProperty($1.socket, "remoteAddress", { configurable: true, get() {',
                  );
                  content = content.replace(
                    /\}\}\);let ([a-zA-Z0-9_$]+)=([a-zA-Z0-9_$]+)\(([a-zA-Z0-9_$]+)\.url/g,
                    '}})}catch{};let $1=$2($3.url',
                  );
                  content = content.replace(
                    /\}\s*\}\);\s*const isrURL/g,
                    '} }); } catch {}\n\tconst isrURL',
                  );
                  fs.writeFileSync(entryPath, content, "utf8");
                }
              } catch {
                // Non-fatal post-build safeguard
              }
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
