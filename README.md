# Origami product boilerplate [![Build Status][travis-image]][travis-url] [![Dependency Status][devdeps-image]][devdeps-url]

This is an attempt to define a useful starting point for apps using Origami components.

Like [HTML5 Boilerplate](https://html5boilerplate.com/), it is not completely barebones – it contains a bit of placeholder content to show how you might use certain components. But it should be considered 'delete key friendly'.

The development workflow and build process are loosely based on Yeoman's original [webapp generator](https://github.com/yeoman/generator-webapp) and Google's [Web Starter Kit](https://github.com/google/web-starter-kit).

## How to use

1. Clone this repo
2. `npm install && bower install`
3. `gulp serve`
4. Develop files in `./app`

## Tasks

- `gulp serve` runs a development server
  - Bonus task: `npm run serve` uses nodemon to run `gulp serve`, and restarts it whenever you edit the gulpfile.

- `gulp build` builds a compressed, deployable app in `dist`

## What it includes

- A basic HTML boilerplate, pieced together from the docs at [origami.ft.com/docs/developer-guide](http://origami.ft.com/docs/developer-guide).
- Browserify, with sourcemaps
  - in development mode it uses [watchify](https://github.com/substack/watchify) for very fast, incremental rebuilds
- Ruby Sass, with sourcemaps
- BrowserSync (like LiveReload but better)
- Concatenation and minification

Does not include revving (yet).


### Components used

- [o-header](http://registry.origami.ft.com/components/o-header)
- [o-footer](http://registry.origami.ft.com/components/o-footer)
- [o-colors](http://registry.origami.ft.com/components/o-colors)

Plus it uses [o-fonts](http://registry.origami.ft.com/components/o-fonts) via the build service.

> todo: include some javascripty components, and ensure it's easy to `require()` them



<!-- badge URLs -->
[travis-url]: http://travis-ci.org/callumlocke/origami-product-boilerplate
[travis-image]: https://img.shields.io/travis/callumlocke/origami-product-boilerplate.svg?style=flat-square

[devdeps-url]: https://david-dm.org/callumlocke/origami-product-boilerplate#info=devDependencies
[devdeps-image]: https://img.shields.io/david/dev/callumlocke/origami-product-boilerplate.svg?style=flat-square
