import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.stashortrashhub.app",
  appName: "Stash Or Trash",
  webDir: ".output/public",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    url: process.env.CAPACITOR_SERVER_URL || "https://stash-or-trash-8x7x1cs5w-rooftop-mashaos-projects.vercel.app",
    cleartext: false,
  },
};

export default config;
