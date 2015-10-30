# Origami product boilerplate

[![Build Status][travis-image]][travis-url] [![Dependency Status][devdeps-image]][devdeps-url]

This repo is a starting point for new front-end apps that employ Origami components.

The included build system is loosely based on Yeoman's original [webapp generator](https://github.com/yeoman/generator-webapp) and Google's [Web Starter Kit](https://github.com/google/web-starter-kit).


## What's included

- `serve` and `build` tasks (similar to [Yeoman](http://yeoman.io/learning/index.html)'s)
- [BrowserSync](http://www.browsersync.io/)
- [Bower](http://bower.io/) (configured to use Origami)
- [origami-build-tools](https://github.com/Financial-Times/origami-build-tools), which provides:
    - [Webpack](https://webpack.github.io/)
    - [node-sass](https://github.com/sass/node-sass)
    - [ESLint](http://eslint.org/)
    - [SCSS-Lint](https://github.com/causes/scss-lint)

Watch-driven rebuilds (during `serve`) are fairly incremental (i.e. fast) and include sourcemaps.


## Documentation

- [Getting started](docs/README.md)
- [Recipes](docs/recipes/README.md)


## Primary tasks

- `gulp serve` — runs a development server, opens it in your browser, and incrementally rebuilds and reloads your browser whenever source files change

- `gulp build` — builds a compressed, deployable app in `dist`

Bonus command: `npm run serve` is another way to run `gulp serve`, with the added benefit that it will automatically restart whenever you edit the gulpfile.


### Components

These Origami components are included as standard:

- [o-colors](http://registry.origami.ft.com/components/o-colors)
- [o-hoverable](http://registry.origami.ft.com/components/o-hoverable)
- [o-fonts](http://registry.origami.ft.com/components/o-fonts)

Other components can be added easily – see [recipes](docs/recipes/README.md).


<!-- badge URLs -->
[travis-url]: http://travis-ci.org/callumlocke/origami-product-boilerplate
[travis-image]: https://img.shields.io/travis/callumlocke/origami-product-boilerplate.svg?style=flat-square

[devdeps-url]: https://david-dm.org/callumlocke/origami-product-boilerplate#info=devDependencies
[devdeps-image]: https://img.shields.io/david/dev/callumlocke/origami-product-boilerplate.svg?style=flat-square
