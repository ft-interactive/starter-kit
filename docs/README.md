# Documentation

## Quick start

Just `cd` into an empty directory and run this command:

```sh
$ curl -L https://raw.githubusercontent.com/callumlocke/init-opb/master/init.js | node
```

(See [init-opb](https://github.com/callumlocke/init-opb) for what that command does.)


## Manual start

1. Download a snapshot of this repo, then delete `docs`, `README.md` and `travis.yml`. This will be your starting point.
2. Run `npm install && bower install && bundle install`
3. Use the tasks:
  - Run `npm start` to start a watch-driven development server with BrowserSync.
  - Run `gulp build` to make a production build.

<!-- 

### 1. Clone the repo

`cd` to wherever you keep your projects (e.g. `~/code`), clone this repo into a new directory (named whatever you want to call your project), and then `cd` into the created directory.

```sh
$ cd ~/code
$ git clone https://github.com/callumlocke/origami-product-boilerplate my-new-project
$ cd my-new-project
```

### 2. Install dependencies

Install npm, bower and Ruby dependencies. Here's a one-liner:

```sh
npm install && bower install && bundle install
```

> Notes:
> - `npm install` looks in `package.json`, then sets up a local `node_modules` folder, containing Node packages used for building the project. (This takes a while!)
> - `bower install` looks in `bower.json`, then sets up a local `bower_components` folder, containing front-end components (mostly JavaScript and CSS things).
> - `bundle install` looks in `Gemfile` and then ensures your system has the necessary Ruby gems installed.
 -->

## Developing your application

Open your project directory in your preferred editor (e.g. `subl .` or `atom .`).

Then run this command to begin an ongoing development build, and start a local web server:

```sh
$ gulp serve
```

After 5-10 seconds, the site should automatically open in your web browser.

Try editing some files in the `client` folder. Whenever you save one of these files, it will trigger whatever build tasks are necessary, and then reload your web browser when it's ready. This should rarely take more than a few seconds.

When you want to stop working, quit out of `gulp serve` by typing <kbd>CTRL+C</kbd>.


### Making a production build

```sh
$ gulp build
```

That will build your project into a folder named `dist`.

The main differences of the production build are:

- All the HTML, CSS and JavaScript is minified (and there are no sourcemaps).
- Adjacent scripts and stylesheets are concatenated into single files.
- Some short scripts and stylesheets are [smooshed](https://github.com/gabrielflorit/gulp-smoosher) into the HTML (meaning their contents are pulled inline, so they are executed sooner during page load)


# More depth

- [Understanding the gulpfile](understanding-the-gulpfile.md)
