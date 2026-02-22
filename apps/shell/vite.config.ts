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
      remotes: {
        analytics: {
          name: "analytics",
          type: "module",
          entry: "http://localhost:4171/mf-manifest.json"
        },
        commerce: {
          name: "commerce",
          type: "module",
          entry: "http://localhost:4172/mf-manifest.json"
        },
        settings: {
          name: "settings",
          type: "module",
          entry: "http://localhost:4173/mf-manifest.json"
        }
      },
      runtimePlugins: ["./src/mf/retryRuntimePlugin.ts"],
      shared: ["react", "react-dom", "react-router-dom"],
      dts: false
    })
  ]
});
