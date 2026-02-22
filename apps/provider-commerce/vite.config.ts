import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext"
  },
  server: {
    host: "0.0.0.0",
    port: 4172,
    origin: "http://localhost:4172"
  },
  preview: {
    host: "0.0.0.0",
    port: 4172
  },
  plugins: [
    react(),
    federation({
      name: "commerce",
      manifest: true,
      exposes: {
        "./registration": "./src/registration.ts"
      },
      shared: ["react", "react-dom"],
      dts: false
    })
  ]
});
