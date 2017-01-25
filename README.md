# Starter Kit [![Build Status][circle-image]][circle-url] [![Dependency Status][dependencyci-image]][dependencyci-url]

A template for IG projects – everything you need to build a standalone web app with FT page furniture, configured to automatically deploy to the web.

### How to use

Paste this snippet into your terminal to run the setup script:

```shell
eval "$(curl -s https://ig.ft.com/starter-kit/install)"
```

Note: this will attempt create a Github repo so you'll need an [access token](https://github.com/settings/tokens) if you want this bit of the script to work. _(TK: where to put this token?)_

#### Tasks

You can run these tasks from within your project directory:

- `npm start` – starts up a development server and opens your app in a web browser. The dev server will automatically reload your browser when files change.
- `npm run build` - builds your app and puts it in the `dist` folder.
- `npm run deploy` – deploys the contents of your `dist` folder to an appropriate location on S3. (You usually don't need to run this yourself – it is run automatically by CircleCI.)

See the [`package.json`](package.json) for other tasks.

### What's included in Starter Kit?

- A template for a basic **front end app** with FT.com page furniture ([Origami](http://registry.origami.ft.com/components)   components) and various best-practice features such as meta tags for SEO and social network sharing, ready to fill in.
- A **[gulp](http://gulpjs.com/) build system** including tasks for serving your app locally during development (auto-refreshing when you edit source files) and building an optimised HTML/CSS/JS bundle suitable for deployment.
  - This includes [Babel](https://babeljs.io/docs/learn-es2015/), [Browserify](http://browserify.org/), [Sass](https://github.com/sass/node-sass), and [Nunjucks templates](https://mozilla.github.io/nunjucks/templating.html).
- A **configuration** for CircleCI to make it deploy the project to S3 when it builds (more details on this below).

### Automatic deployment (<abbr title="Continuous Integration">CI</abbr>)

Whenever you add _any_ repository to the [ft-interactive](https://github.com/ft-interactive) GitHub org, our [Buildbot](https://github.com/ft-interactive/ft-ig-github-project-manager) automatically sets up a new CircleCI project linked to the new repo. That means CircleCI will automatically build it whenever you add a commit to that repo (whether on master or other branches).

How does Starter Kit come into this? Starter Kit includes a `circle.yml` file, which configures CircleCI to run `npm run deploy` after any successful builds. This means that all you have to do is commit a change to your project, and push the commit to GitHub (or just make the change directly on the GitHub website), and it should get deployed within a few minutes.

### Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

<!-- badge URLs -->
[circle-url]: https://circleci.com/gh/ft-interactive/starter-kit
[circle-image]: https://circleci.com/gh/ft-interactive/starter-kit/tree/master.svg?style=shield

[dependencyci-url]: https://dependencyci.com/github/ft-interactive/starter-kit
[dependencyci-image]: https://dependencyci.com/github/ft-interactive/starter-kit/badge
