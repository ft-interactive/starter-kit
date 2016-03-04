# Starter Kit

> Boilerplate to kick-start a new FT Interactive project

[![Build Status][circle-image]][circle-url] [![Dependency Status][devdeps-image]][devdeps-url]

## Usage

**Download**

Don't clone this repo. If you have [startfrom](https://github.com/callumlocke/startfrom) installed...

```shell
> startfrom ft-interactive/starter-kit
```

**Development**

Run a dev server, build code and refresh when code changes:

```
$ npm start
```

**Publish**

Build the code ready to be deployed: 

```
$ npm run build
```

Builds into a `dist` folder.

**Full instructions**

* [In-depth instructions](https://ft-interactive.github.io/guides/starter-kit/) on our Developer Guide
* The are also [Recipes](docs/recipes/README.md) for how to code things up


## Includes

- Origami components, some via the [bower registry](http://registry.origami.ft.com/components) others via the [build service](https://build.origami.ft.com/).
- [Browserify](http://browserify.org/)
- [node-sass](https://github.com/sass/node-sass)
- Linting: [ESLint](http://eslint.org/) | ~~[SCSS-Lint](https://github.com/causes/scss-lint)~~*


* SCSS-lint has been removed until we can find a non-Ruby version.
You can still use it manually: `gem install scss-lint` then `scss-lint client/**/*.scss`


## Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

<!-- badge URLs -->
[circle-url]: https://circleci.com/gh/ft-interactive/starter-kit
[circle-image]: https://circleci.com/gh/ft-interactive/starter-kit/tree/master.svg?style=svg

[devdeps-url]: https://david-dm.org/ft-interactive/starter-kit#info=devDependencies
[devdeps-image]: https://img.shields.io/david/dev/ft-interactive/starter-kit.svg?style=flat-square
