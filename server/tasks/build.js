/**
 * This is responsible for the initial build
 */

import glob from 'glob';
import { resolve, extname } from 'path';
import { copyFile } from 'sander';

import buildSass from './styles';
import buildScript from './scripts';
import buildHtml from './templates';
import revAssets from './rev';

export default function () {
  glob(resolve(__dirname, '../../client/**/*'), (err, files) => {
    files.forEach(file => {
      switch (extname(file)) {
        case '.scss':
          buildSass(file);
          break;
        case '.html':
          buildHtml(file);
          break;
        case '.js':
          buildScript(file);
          break;
        default:
          copyFile(file).to(file.replace('client', 'dist'));
          break;
      }
    });

    revAssets(null, true); // Rev *all* assets (that aren't index.html)
  });
}
