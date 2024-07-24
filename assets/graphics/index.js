/**
 * Automatically imports ai2html files from subdirectories
 * The expected file structure is like:
 *   graphic-name/
 *      graphic-name.html
 *      graphic-name-size1.jpg
 *      graphic-name-size2.jpg
 *
 * (Effectively, you should copy over the ai2html-output folder, rename it, then put it in this dir.)
 */

import { ALT } from '../util';

const DEFAULT_GRAPHIC_PROPS = {
  imageService: import.meta.env.MODE === 'production',
  // Add any other story-default graphic props here
  // alt: ''
};

const htmlFiles = import.meta.glob(['./*/*.html', '!*.preview.html'], {
  eager: true,
  query: '?raw',
  import: 'default',
});

const imageFiles = import.meta.glob('./*/*.{png,jpg,jpeg,gif}', { eager: true, import: 'default' });

const imageMap = Object.entries(imageFiles).reduce((acc, [file, img]) => {
  const name = file.match(/^\.\/[\w-_]+\/([^/]+\.(?:png|jpg|jpeg|gif))$/)[1];
  return {
    ...acc,
    [name]: img,
  };
}, {});

const graphics = Object.entries(htmlFiles).reduce((acc, [file, html]) => {
  // Extract the ai2html embed name from the file
  const name = file.match(/^\.\/[\w-_]+\/([^/]+)\.html$/)[1];

  // Filter the image map to only the ones from this embed
  const images = Object.entries(imageMap)
    .filter(([src]) => src.startsWith(name))
    .reduce(
      (obj, [src, newSrc]) => ({
        ...obj,
        [src]: newSrc,
      }),
      {}
    );

  // Return the props that are spread into the <Graphic> component
  return {
    ...acc,
    [name.toLowerCase()]: {
      ...DEFAULT_GRAPHIC_PROPS,
      html,
      images,
      alt: ALT[name],
      id: `vs-g-${name}`,
    },
  };
}, {});

export default graphics;
