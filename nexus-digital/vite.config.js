import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // <-- Changed from @vue/plugin-vue to @vitejs/plugin-vue
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})