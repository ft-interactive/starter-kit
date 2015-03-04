# Origami product boilerplate

[![Build Status][travis-image]][travis-url] [![Dependency Status][devdeps-image]][devdeps-url]

This repo can be used as starting point for new apps. It comes with a couple of Origami components out of the box, but it should be considered 'delete key friendly'.

The included build system is loosely based on Yeoman's original [webapp generator](https://github.com/yeoman/generator-webapp) and Google's [Web Starter Kit](https://github.com/google/web-starter-kit).


## Features

- `serve` and `build` tasks a la Yeoman
- BrowserSync
- Bower (configured to use Origami)
- Browserify (with sourcemaps and incremental rebundles)
- Ruby Sass (with sourcemaps)
- JSHint and SCSS-Lint


## Documentation

- [Getting started](docs/README.md)
- [Recipes](docs/recipes/README.md) for common tasks (like adding components)


## Primary tasks

- `gulp serve` — runs a development server, opens it in your browser, and incrementally rebuilds and reloads your browser whenever source files change

- `gulp build` — builds a compressed, deployable app in `dist`

Bonus command: `npm run serve` is another way to run `gulp serve`, with the difference that it will automatically restart whenever you edit the gulpfile.


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
