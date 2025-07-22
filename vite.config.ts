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
  assetsInclude: ['**/*.ico', '**/*.svg', '**/*.jpg', '**/*.jpeg', '**/*.png'],
  define: {
    // Ensure consistent React environment
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    __DEV__: mode !== 'production'
  },
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
    force: true,
    // Ensure React is pre-bundled correctly
    esbuildOptions: {
      target: 'es2020'
    }
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
      external: (id) => {
        // Don't externalize React in our build - keep it bundled to avoid multiple instances
        return false;
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // Force all React-related code into a single chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Keep other vendors separate
          'vendor-supabase': ['@supabase/supabase-js'],
          // Admin chunk for admin-related code
        }
      }
    }
  }
}));
