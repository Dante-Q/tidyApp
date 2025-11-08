import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // auto-open report in browser
      filename: "bundle-report.html", // name of HTML file
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 5173, // default Vite port
    allowedHosts: [
      "ironbound-unappeasingly-ruthie.ngrok-free.dev",
      ".ngrok-free.dev", // Allow any ngrok-free.dev subdomain
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5000", // your Express backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
