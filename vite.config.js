import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dsv from '@rollup/plugin-dsv';
import vike from 'vike/plugin';
import { resolve } from 'node:path';

import { _ssrBrowserAllowList } from './package.json';
import getContext from './config/index.js';

// Because a bunch of origami libraries don't list a 'main' entrypoint, we have to override their resolution

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const context = await getContext(mode, { withData: false });

  return {
    root: '.',
    base: context.url,
    resolve: {
      /* Certain origami modules only offer a 'browser' entrypoint,
       * so we update them to work on the server by setting an alias:
       * e.g. @financial-times/o-grid -> @financial-times/o-grid/main.js
       * (To add more packages, update the _ssrBrowserAllowList in package.json)
       */
      alias: [
        {
          find: new RegExp(`^(${_ssrBrowserAllowList.join('|')})/?$`, 'i'),
          replacement: resolve(process.cwd(), 'node_modules/$1/main.js'),
        },
      ],
    },
    ssr: {
      // We must compile these modules into the SSR build so the above alias rules are applied
      noExternal: ['@financial-times/g-components', '@ft-interactive/vs-components'],
      external: ['@/config/data.json'],
    },
    plugins: [react(), vike({ prerender: true }), dsv()],
  };
});
