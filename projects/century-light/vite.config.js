import { defineConfig } from 'vite';
export default defineConfig({base:'./',server:{watch:{ignored:['**/output/**','**/blender/**','**/references/**']}},build:{outDir:'dist',chunkSizeWarningLimit:800,rollupOptions:{output:{manualChunks:{three:['three']}}}}});
