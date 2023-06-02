import { defineConfig } from 'vite';
import generateFile from 'vite-plugin-generate-file';
import react from '@vitejs/plugin-react';
import getContext from './config/index.js';

const data = await getContext();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    generateFile([
      {
        type: 'json',
        output: './context.json',
        data,
      },
    ]),
    react(),
  ],
});
