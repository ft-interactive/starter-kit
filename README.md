# Starter Kit [![Build Status][circle-image]][circle-url] [![Dependency Status][dependencyci-image]][dependencyci-url]

A template for IG projects — everything you need to build a standalone front end app (including some basic FT page furniture), configured to automatically deploy to the web.

---

## How to use

#### Getting started

To start a new project based on Starter Kit, run this setup script in your terminal:

```sh
eval "$(curl -s https://ig.ft.com/starter-kit/install)"
```

What the setup script does:

- Asks you a few questions about your project (e.g. title, description).
- Clones Starter Kit to your own computer (but reinitialises it as a brand new git repo with no history).
- If selected, attempts to push it to the ft-interactive org on GitHub.
  - NB. you'll need an [access token](https://github.com/settings/tokens) and the git [osxkeychain helper](https://help.github.com/articles/caching-your-github-password-in-git/) for this to work. Create a file in your home directory called `.netrc` containing the following:
```
machine api.github.com
login <your-github-username>
password <your-github-access-token>
protocol https
```
- Runs `npm install` to grab all the dependencies (this takes a few minutes).
- Runs `npm start` for the first time — now you can start coding.

You can also re-initialise a Starter Kit project to use the latest version by providing a path
to an existing project in the first step of the wizard. This will put everything in the folder into
a new commit (*including* things that aren't version controlled and aren't in .gitignore), wipe the
folder, then add Starter Kit as a new commit. It doesn't try to upgrade your code at all, though
you can generally restore everything by running the following afterwards:

```bash
git checkout HEAD~1 -- client config
```
This assumes your project keeps most of your data in the `client/` and `config/` folders.

#### Using the built in tasks

You can run the following tasks from within your project directory:

- `npm start` — starts up a development server and opens your app in a web browser. The dev server will automatically reload your browser when files change.
- `npm run build` — builds your app and puts it in the `dist` folder.
- `npm run deploy` — deploys the contents of your `dist` folder to an appropriate location on S3. (You usually don't need to run this yourself — it is run automatically by CircleCI.)

(You can find a few other, less interesting tasks defined in [`package.json`](package.json).)

#### Key directories

- [`client`](client) — the main files that make up your front end, including `index.html` and some Sass and JS files. You should mostly be working in here.
- [`config`](config) — scripts that pull together some configuration details for your project, including basic facts (UUID, title, etc.) and 'onward journey' story links. These details are used to populate parts of the templates.
- [`views`](views) — the standard page layout is formed from a few files in here (the project-specific files in `client` extend this layout). You generally don't need to edit this much.
- `dist` — the optimsed HTML/CSS/JS bundle, generated automatically every time you run `npm run build`. You shouldn't edit files in here manually, as any manual changes would just get overwritten next time you build.

## What's included in Starter Kit?

- A template for a basic **front end app** with FT.com page furniture
  - Includes [Origami components](https://origami-bower-registry.ft.com/components) and various best-practice features such as meta tags to optimise SEO and social sharing.
- A **build system** including tasks for serving your app locally during development (auto-refreshing when you edit source files) and building an optimised HTML/CSS/JS bundle suitable for deployment.
  - This is comprised of [gulp](http://gulpjs.com/), [Babel](https://babeljs.io/docs/learn-es2015/), [Browserify](http://browserify.org/), [Sass](https://github.com/sass/node-sass), and [Nunjucks templates](https://mozilla.github.io/nunjucks/templating.html).
- A **CI configuration** that instructs CircleCI to deploy the project to S3 every time it builds.

## Understanding automatic deployment ('continuous integration')

Whenever you add _any_ repository to the [ft-interactive](https://github.com/ft-interactive) GitHub org, the [IG Buildbot](https://github.com/ft-interactive/ft-ig-github-project-manager) automatically sets up a new CircleCI project linked to the new repo. That means CircleCI will build the project whenever you add a new commit to that repo (whether on master or other branches).

How does Starter Kit come into this? Starter Kit includes a [`circle.yml`](circle.yml) file that instructs CircleCI to run `npm run deploy` after any successful builds. This means that all you have to do is commit a change to your project, and push the commit to GitHub (or just make the change directly on the GitHub website), and it should get deployed within a few minutes. (The deploy script automatically decides what path to upload files to, based on the name of the repo on GitHub.) This process is called **continuous integration**.

## Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

<!-- badge URLs -->
[circle-url]: https://circleci.com/gh/ft-interactive/starter-kit
[circle-image]: https://circleci.com/gh/ft-interactive/starter-kit/tree/master.svg?style=shield

[dependencyci-url]: https://dependencyci.com/github/ft-interactive/starter-kit
[dependencyci-image]: https://dependencyci.com/github/ft-interactive/starter-kit/badge
