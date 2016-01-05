# Starter Kit

> Boilerplate to kick-start a new FT Interactive project

[![Build Status][travis-image]][travis-url] [![Dependency Status][devdeps-image]][devdeps-url]

## Usage

**Quick start**

If you already have [startfrom](https://github.com/callumlocke/startfrom) installed...

```shell
> startfrom ft-interactive/starter-kit
```

**Full instructions**

[Read in-depth instructions on our Developer Guide](https://ft-interactive.github.io/guides/starter-kit/).

## What's included

- `serve` and `build` tasks (similar to [Yeoman](http://yeoman.io/learning/index.html)'s)
- [Browserify](http://browserify.org/)
- [node-sass](https://github.com/sass/node-sass)
- [ESLint](http://eslint.org/)
- [SCSS-Lint](https://github.com/causes/scss-lint)
- [Bower](http://bower.io/) (configured to try Origami's registry first)

## Documentation

- [Guide on the dev site](http://ft-interactive.github.io/guides/starter-kit/)
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

## Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

<!-- badge URLs -->
[travis-url]: http://travis-ci.org/ft-interactive/starter-kit
[travis-image]: https://img.shields.io/travis/ft-interactive/starter-kit.svg?style=flat-square

[devdeps-url]: https://david-dm.org/ft-interactive/starter-kit#info=devDependencies
[devdeps-image]: https://img.shields.io/david/dev/ft-interactive/starter-kit.svg?style=flat-square
