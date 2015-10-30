# Project Starter Kit
#### For FT Interactive Projects

[![Build Status][travis-image]][travis-url] [![Dependency Status][devdeps-image]][devdeps-url]

## What's included

- `serve` and `build` tasks (similar to [Yeoman](http://yeoman.io/learning/index.html)'s)
- [WebPack](https://webpack.github.io/)
- [Bower](http://bower.io/) (configured to use Origami)
- [origami-build-tools](https://github.com/Financial-Times/origami-build-tools), which provides:
    - [Webpack](https://webpack.github.io/)
    - [node-sass](https://github.com/sass/node-sass)
    - [ESLint](http://eslint.org/)
    - [SCSS-Lint](https://github.com/causes/scss-lint)


## Documentation

- [Guide on the dev site](http://ft-interactive.github.io/guides/project-starter-kit/)
- [Recipes](docs/recipes/README.md)


## Primary tasks

- `npm start` — runs a development server, opens it in your browser, and incrementally rebuilds and reloads your browser whenever source files change

- `npm run build` — builds a compressed, deployable app in `dist`


### Components

These Origami components are included as standard:

- [o-colors](http://registry.origami.ft.com/components/o-colors)
- [o-hoverable](http://registry.origami.ft.com/components/o-hoverable)
- [o-fonts](http://registry.origami.ft.com/components/o-fonts)

Other components can be added easily – see [recipes](docs/recipes/README.md).


<!-- badge URLs -->
[travis-url]: http://travis-ci.org/ft-interactive/project-starter-kit
[travis-image]: https://img.shields.io/travis/ft-interactive/project-starter-kit.svg?style=flat-square

[devdeps-url]: https://david-dm.org/ft-interactive/project-starter-kit#info=devDependencies
[devdeps-image]: https://img.shields.io/david/dev/ft-interactive/project-starter-kit.svg?style=flat-square
