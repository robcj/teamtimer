import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.teamtimer.app",
  appName: "Team Timer",
  webDir: "www",
  server: {
    androidScheme: "https"
  }
};

export default config;
