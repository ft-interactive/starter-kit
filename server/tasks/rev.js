/**
 * Tasks for rev'ing everything
 *
 */

import { sync as rev } from 'rev-file';
import { unlink } from 'fs';
import { resolve } from 'path';
import { copyFile, writeFile } from 'sander';
import { glob, errMsg } from '../shared';

const manifestPath = resolve(__dirname, '../../', 'dist/', 'rev-manifest.json');
const revRegex = /.+?-[a-z0-9]{10}\.(?:js|css|html)$/;
const revGlob = 'dist/**/*.{js,css,html,ttf,otf,gif,jpg,jpeg,png}';

export async function clearAllRevved() {
  const allFiles = await glob(revGlob);
  allFiles.forEach(filePath => {
    if (filePath.match(revRegex)) {
      unlink(filePath, (err) => {
        if (err) {
          console.error(errMsg('Error clearing rev cache:'));
          console.error(err);
        }
      });
    }
  });
}

export default async function (path, all = false) {
  if (all || !path) {
    clearAllRevved(); // @TODO decide if this should be triggered by something

    try {
      const allFiles = await glob(revGlob);
      const manifest = allFiles.reduce((last, curr) => {
        if (!curr.match(revRegex) && !~curr.indexOf('index.html')) {
          last[curr.replace('dist/', '')] = rev(curr).replace('dist/', '');
        }

        return last;
      }, {});

      Object.keys(manifest).forEach(async key => {
        try {
          await copyFile(resolve(__dirname, '../../dist', key))
            .to(resolve(__dirname, '../../dist', manifest[key]));
        } catch (e) {
          console.error(errMsg('Error copying revv\'d asset:'));
          console.error(e);
        }
      });

      writeFile(manifestPath, JSON.stringify(manifest));
    } catch (e) {
      console.error(errMsg('Error revving:'));
      console.error(e);
    }
  } else {
    // @TODO Do something with individual files here? /shrug
  }
}
