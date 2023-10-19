import { defineConfig } from 'vite';
import generateFile from 'vite-plugin-generate-file';
import react from '@vitejs/plugin-react';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import dsv from '@rollup/plugin-dsv';
import getContext from './config/index.js';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const context = await getContext(mode);

  return {
    base: './',
    plugins: [
      ViteEjsPlugin(context, {
        ejs: {
          _with: false,
          localsName: 'context',
        },
      }),
      generateFile([
        {
          type: 'json',
          output: './context.json',
          data: context,
        },
      ]),
      react(),
      dsv(),
    ],
  };
});
