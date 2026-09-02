/**
 * Performance & optimization configuration
 * - Code splitting by route
 * - Image optimization
 * - Bundle analysis
 */

import type { UserConfig } from 'vite';

export const performanceConfig: UserConfig = {
  build: {
    // Target modern browsers only (smaller bundles)
    target: 'esnext',
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splitting
          'vendor-react': ['react', 'react-dom'],
          'vendor-tanstack': ['@tanstack/react-query', '@tanstack/react-router'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'vendor-charts': ['recharts'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // Minify aggressively
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        passes: 2,
      },
      mangle: true,
    },
    // CSS splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  // Optimized preload/prefetch
  ssr: {
    external: ['@supabase/supabase-js'],
  },
};
