// vite.dev.config.js - Development-only configuration with proper static file serving
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// This is a special development-only configuration
// It ensures static files are served correctly from the public directory
export default defineConfig({
  // No base path for development
  base: "",
  server: {
    host: "::",
    port: 5174,
    // Ensure static files are properly served
    fs: {
      strict: false,
    }
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Make static asset handling explicit
  publicDir: "public",
  // Always use development mode
  mode: "development",
});
