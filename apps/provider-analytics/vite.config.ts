import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext"
  },
  server: {
    host: "0.0.0.0",
    port: 4171,
    origin: "http://localhost:4171"
  },
  preview: {
    host: "0.0.0.0",
    port: 4171
  },
  plugins: [
    react(),
    federation({
      name: "analytics",
      manifest: true,
      exposes: {
        "./registration": "./src/registration.ts"
      },
      shared: ["react", "react-dom"],
      dts: false
    })
  ]
});
