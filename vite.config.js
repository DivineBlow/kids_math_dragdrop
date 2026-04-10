import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Увеличиваем лимит предупреждения (необязательно, но полезно)
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // Разделяем библиотеки и ваш код на разные файлы
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Все зависимости из npm (Three.js, confetti) уйдут в отдельный файл vendor
            return 'vendor';
          }
        },
      },
    },
  },
});
