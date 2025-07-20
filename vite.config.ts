import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ShatamCareFoundation/' : '/',
  server: {
    host: "::",
    port: 5174,
  },
  publicDir: 'public',
  plugins: [react()],
  assetsInclude: ['**/*.ico', '**/*.svg'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('@supabase')) return 'vendor-supabase';
            return 'vendor'; // all other node_modules
          }
          if (id.includes('components/admin')) return 'admin';
        }
        }
      }
    }
  }
}));
