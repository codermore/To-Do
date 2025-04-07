export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Reemplaza con la URL de tu backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
