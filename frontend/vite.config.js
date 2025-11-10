import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false, // Don't auto-open in production builds
      filename: "bundle-report.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Production build optimizations
    minify: "terser",
    sourcemap: false, // Disable source maps in production for security
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          mantine: ["@mantine/core", "@mantine/hooks", "@mantine/form"],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Development backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
