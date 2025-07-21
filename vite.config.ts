import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: mode === 'production' ? '/ShatamCareFoundation/' : '/',
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
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    exclude: ['@radix-ui/react-tooltip'],
    force: true
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps for production
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Keep React and React-DOM together in one chunk
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('react-router')) return 'vendor-router';
            return 'vendor';
          }
          if (id.includes('admin')) return 'admin';
        }
      }
    }
  }
}));
