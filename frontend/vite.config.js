// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./",  // Ensures relative paths for assets
  build: {
    outDir: "dist",  // Ensure build output goes to "dist" folder
  },
  server: {
    port: 5173, // Ensures development server runs on port 5173
  }
});
