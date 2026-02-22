import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext"
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
    origin: "http://localhost:4173"
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  },
  plugins: [
    react(),
    federation({
      name: "settings",
      manifest: true,
      exposes: {
        "./registration": "./src/registration.ts"
      },
      shared: ["react", "react-dom"],
      dts: false
    })
  ]
});
