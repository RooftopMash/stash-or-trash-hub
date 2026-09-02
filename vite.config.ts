import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    cloudflare: {
      wrangler: {
        name: "stash-or-trash-hub",
      },
    },
  },
});
