
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ShatamCareFoundation/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          icons: ['lucide-react'],
          router: ['react-router-dom'],
        },
      },
    },
    // Enable compression and optimization
    minify: 'esbuild', // Use esbuild instead of terser for better compatibility
    target: 'esnext',
    assetsDir: 'assets',
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'react-router-dom'],
  },
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
