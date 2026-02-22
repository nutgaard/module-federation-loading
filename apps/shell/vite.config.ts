import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext"
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    origin: "http://localhost:5173"
  },
  preview: {
    host: "0.0.0.0",
    port: 5173
  },
  plugins: [
    react(),
    federation({
      name: "shell",
      shareStrategy: "loaded-first",
      remotes: {},
      runtimePlugins: ["./src/mf/retryRuntimePlugin.ts"],
      shared: ["react", "react-dom", "react-router-dom"],
      dts: false
    })
  ]
});
