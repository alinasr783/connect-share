import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React optimizations
      jsxRuntime: 'automatic'
    }),
    tailwindcss()
  ],

  // Build optimizations
  build: {
    // Enable minification with better settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },

    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@tanstack')) {
              return 'query-vendor';
            }
            if (id.includes('react-hot-toast')) {
              return 'toast-vendor';
            }
            return 'vendor';
          }

          // Feature chunks
          if (id.includes('/features/')) {
            return 'features';
          }

          // Page chunks
          if (id.includes('/pages/')) {
            return 'pages';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '') : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },

    // Disable source maps for production
    sourcemap: false,

    // Optimize asset handling
    assetsInlineLimit: 2048, // Reduced from 4096

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Target modern browsers for better optimization
    target: 'esnext',

    // Enable tree shaking
    treeshake: true,
  },

  // Development server optimizations
  server: {
    // Enable HTTP/2
    https: false,

    // Optimize HMR
    hmr: {
      overlay: false,
    },
  },

  // CSS optimizations
  css: {
    devSourcemap: false,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },

  // Define environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
})
