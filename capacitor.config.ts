import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.stashortrashhub.app",
  appName: "Stash Or Trash",
  webDir: ".output/public",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    ...(process.env.CAPACITOR_SERVER_URL
      ? { url: process.env.CAPACITOR_SERVER_URL }
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? { url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` }
        : process.env.VERCEL_URL
          ? { url: `https://${process.env.VERCEL_URL}` }
          : {}),
    cleartext: false,
  },
};

export default config;
