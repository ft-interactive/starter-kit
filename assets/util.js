export const sortFiles = (imports, keepNames = true) =>
  Object.entries(imports)
    .sort(([a], [b]) => b - a)
    .map(([name, m]) => (keepNames ? [name, m.default] : m.default));

// Optionally use this dictionary to set alt text on images
// e.g. [name]: 'Alt text goes here'
// Or if you're writing text for an array of images
// e.g. [name]: ['Image 1 alt text', 'Image 2 alt text']
export const ALT = {};

export default { sortFiles, ALT };
