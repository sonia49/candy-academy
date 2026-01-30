import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/candy-academy/', // <--- VERIFIE BIEN CETTE LIGNE
})
