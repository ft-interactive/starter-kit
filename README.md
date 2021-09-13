# Starter Kit [![Build Status][circle-image]][circle-url]

A template for IG projects — everything you need to build a standalone front end app (including some basic FT page furniture), configured to automatically deploy to the web.

---

## How to use

#### Getting started

To start a new project based on Starter Kit, run this setup script in your terminal:

```sh
eval "$(curl -s https://raw.githubusercontent.com/ft-interactive/starter-kit/main/install)"
```

What the setup script does:

- Asks you a few questions about your project (e.g. title, description).
- Clones Starter Kit to your own computer (but reinitialises it as a brand new git repo with no history).
- Runs `npm install` to grab all the dependencies (this takes a few minutes).
- Runs `npm start` for the first time — now you can start coding.

You can also re-initialise a Starter Kit project to use the latest version by providing a path
to an existing project in the first step of the wizard. This will put everything in the folder into
a new commit (_including_ things that aren't version controlled and aren't in .gitignore), wipe the
folder, then add Starter Kit as a new commit. It doesn't try to upgrade your code at all, though
you can generally restore everything by running the following afterwards:

```bash
git checkout HEAD~1 -- client config
```

This assumes your project keeps most of your data in the `app/` and `config/` folders.

#### Using the built in tasks

You can run the following tasks from within your project directory:

- `npm start` — starts up a development server and opens your app in a web browser. The dev server will automatically reload your browser when files change.
- `npm run storybook` — loads up [StorybookJS](https://storybook.js.org/) as a development environment for building components. Stories created in the `app/components` folder will automatically show up in the storybook.
- `npm run build` — builds your app and puts it in the `dist` folder.
- `npm run deploy` — deploys the contents of your `dist` folder to an appropriate location on S3. (You usually don't need to run this yourself — it is run automatically by CircleCI.)
- `npm run a11y:local` - checks accessibility of your app running locally (must be running at localhost:8080 to work)

(You can find a few other, less interesting tasks defined in [`package.json`](package.json).)

#### Key directories

- [`app`](app) — the main files that make up your front end, including `index.html` and some Sass and JS files. You should mostly be working in here.
- [`config`](config) — scripts that pull together some configuration details for your project, including basic facts (UUID, title, etc.) and 'onward journey' story links. These details are used to populate parts of the templates.
  - [`article.js`](config/article.js) — article metadata which replicates most metadata found on FT.com. Add or remove required polyfills here with the `polyfillFeatures` attribute
  - [`flags.js`](config/flags.js) — flags to control page behaviour including ads and comments
  - [`onward-journey.js`](config/index.js) — sets the stream page used to populate the onward journey at the bottom of the page
  - [`index.js`](config/index.js) — the function that collects together all the configuration files in this folder. Use this file to pull in and parse remote data on build. The output of this function is written to `context.json` which `app.js` fetches after initial render
- `dist` — the optimsed HTML/CSS/JS bundle, generated automatically every time you run `npm run build`. You shouldn't edit files in here manually, as any manual changes would just get overwritten next time you build.

## What's included in Starter Kit?

- A template for a basic **front end app** with FT.com page furniture
  - Includes [Origami components](https://registry.origami.ft.com/components) and various best-practice features such as meta tags to optimise SEO and social sharing.
- A **build system** including tasks for serving your app locally during development (auto-refreshing when you edit source files) and building an optimised HTML/CSS/JS bundle suitable for deployment.
- A **CI configuration** that instructs CircleCI to deploy the project to S3 every time it builds.
- A [**StorybookJS configuration**](.storybook/main.js) that looks for stories in the [`app/components`](app/components) folder (including nested folders) and also includes stories from g-components and VVC (if installed). Story files must end in `.stories.mdx` or `.stories.js/jsx/ts/tsx`.

## Understanding automatic deployment ('continuous integration')

To enable continuous integration with CircleCI on a project and to allow you to use buildbot you first need to invite the `visual-data-journalism-admins` group to the repository and [assign them the `Admin` role](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/managing-teams-and-people-with-access-to-your-repository#inviting-a-team-or-person). You can then run `buildbot reinit Financial-Times/PROJECT-NAME` in the `#ig-buildbot` Slack channel. New projects should be created in the [`Financial-Times`](https://github.com/Financial-Times/) GitHub organisation.

CircleCI will build the project whenever you add a new commit to that repo (whether on main or other branches). Starter Kit includes a [`config.yml`](.circleci/config.yml) file that instructs CircleCI to run `npm run deploy` after any successful builds. This means that all you have to do is commit a change to your project, and push the commit to GitHub (or just make the change directly on the GitHub website), and it should get deployed within a few minutes. (The deploy script automatically decides what path to upload files to, based on the name of the repo on GitHub.) This process is called **continuous integration**.

More information on deploying Starter Kit can be found [here](https://github.com/Financial-Times/visual-data-playbook/blob/main/publishing-workflow/ig-page-workflow.md#deploying).

## Using Visual vocabularly components or templates in a Starter Kit project

To use the [Visual vocabularly components (VVC)](https://github.com/Financial-Times/visual-vocabulary-components) chart library in a project you will need to have a working GitHub SSH key in your keychain. Follow the instructions [here](https://github.com/Financial-Times/visual-vocabulary-components#integrating-vvc-into-a-project) for more details. To use VVC in production you will need to add the SSH key in the Project settings for a given repository in CircleCI. Within Project Settings you can find this under `SSH Keys -> Additional SSH Keys -> Add SSH Key`. Make sure to set the `Hostname` to `github.com`.

## Licence

This software is published by the Financial Times under the [MIT licence](https://opensource.org/licenses/MIT).

Please note the MIT licence only covers the software, and does not cover any FT content or branding incorporated into the software or made available using the software. FT content is copyright © The Financial Times Limited, and FT and ‘Financial Times’ are trademarks of The Financial Times Limited, all rights reserved. For more information about republishing FT content, please contact our [republishing department](https://ft.com/republishing).

<!-- badge URLs -->

[circle-url]: https://circleci.com/gh/ft-interactive/starter-kit
[circle-image]: https://circleci.com/gh/ft-interactive/starter-kit/tree/main.svg?style=shield
[dependencyci-url]: https://dependencyci.com/github/ft-interactive/starter-kit
[dependencyci-image]: https://dependencyci.com/github/ft-interactive/starter-kit/badge
