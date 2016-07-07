# Starter Kit

> Boilerplate to kick-start a new project


[![Build Status][circle-image]][circle-url] [![Dependency Status][devdeps-image]][devdeps-url]

## Download


Paste this snippet into your terminal and follow the instructions:

```shell
read -p "Local directory for the project (use lowercase with dashes) : " dir; git clone -b master --single-branch ssh://git@github.com/ft-interactive/starter-kit.git $dir && cd $dir && ./configure && npm start -- --open
```

Note: this will attempt create a Github repo so you need an [access token](https://github.com/settings/tokens) if you want this bit of the script to work.

## Tasks

**Development**

```
$ npm start
```

A dev server that watches for changes.


**Publish**

```
$ npm run build
```

Builds the code into a `dist` folder ready to be deployed.

## Includes

- [Babel](https://babeljs.io/docs/learn-es2015/)
- [Sass](https://github.com/sass/node-sass)
- [Browsersync](https://www.browsersync.io/docs)
- [Origami modules](http://registry.origami.ft.com/components)  
  –– using [build service](https://build.origami.ft.com/) _and_ [bower components](http://origami.ft.com/docs/developer-guide/modules/choosing-your-build-method/)
- [Browserify](http://browserify.org/)

## Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

<!-- badge URLs -->
[circle-url]: https://circleci.com/gh/ft-interactive/starter-kit
[circle-image]: https://circleci.com/gh/ft-interactive/starter-kit/tree/master.svg?style=shield

[devdeps-url]: https://david-dm.org/ft-interactive/starter-kit#info=devDependencies
[devdeps-image]: https://img.shields.io/david/dev/ft-interactive/starter-kit.svg?style=flat-square
