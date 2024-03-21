# Starter Kit [![Build Status][circle-image]][circle-url]

A template for IG projects — everything you need to build a standalone front end app (including some basic FT page furniture), configured to automatically deploy to the web.

---

## How to use

#### Getting started

Select the green `Use this template` button at the top of the page to Create a new repository. New projects should be created in the [`ft-interactive`](https://github.com/ft-interactive/) GitHub organisation. Follow the steps as prompted to clone your repository locally. If it is your first time running a Starter Kit project follow the [setup instructions for vs-components](https://github.com/ft-interactive/vs-components#setup). Then run `npm install` in your terminal at the project root directory.

#### Using the built in tasks

You can run the following tasks from within your project directory:

- `npm start` — starts up a development server and opens your app in a web browser. The dev server will automatically reload your browser when files change.
- `npm run build` — builds your app in production and puts it in the `dist` folder.
- `npm run preview` — builds your app in production mode and starts a webserver from the `dist` folder, to preview the production bundle
- `npm run a11y:local` - checks accessibility of your app running locally (must be running at localhost:8080 to work)
- `npm run deploy` — deploys the contents of your `dist` folder to an appropriate location on S3. (You usually don't need to run this yourself — it is run automatically by CircleCI.)
- `npm run data` - runs any data-fetching code in `config/data.js` and caches the results in `config/data.json`. (If you run this script, the config setup will read from the file instead of fetching data each time.)

(You can find a few other, less interesting tasks defined in [`package.json`](package.json).)

#### Key directories

- [`app`](app) — the main files that make up your front end, including `index.html` and some Sass and JS files. You should mostly be working in here.
- [`config`](config) — scripts that pull together some configuration details for your project, including basic facts (UUID, title, etc.) and 'onward journey' story links. These details are used to populate parts of the templates.
  - [`article.js`](config/article.js) — article metadata which replicates most metadata found on FT.com. Add or remove required polyfills here with the `polyfillFeatures` attribute
  - [`flags.js`](config/flags.js) — flags to control page behaviour including ads and comments
  - [`onward-journey.js`](config/index.js) — sets the stream page used to populate the onward journey at the bottom of the page
  - [`data.js`](config/data.js) — an empty method where you can add data-fetching or -loading logic
  - [`index.js`](config/index.js) — the function that collects together all the configuration files in this folder and makes it available to the app inside the `context` provider
- `dist` — the optimsed HTML/CSS/JS bundle, generated automatically every time you run `npm run build`. You shouldn't edit files in here manually, as any manual changes would just get overwritten next time you build.

## What's included in Starter Kit?

- A template for a basic **front end app** with FT.com page furniture
  - Includes [Origami components](https://registry.origami.ft.com/components) and various best-practice features such as meta tags to optimise SEO and social sharing.
- A **build system** including tasks for serving your app locally during development (auto-refreshing when you edit source files) and building an optimised HTML/CSS/JS bundle suitable for deployment.
- A **CI configuration** that instructs CircleCI to deploy the project to S3 every time it builds.

## How do I deploy my project?

Starter-Kit projects are usually deployed automatically using [CircleCI](https://circleci.com) whenever you push to Git. This repo already contains a `.circleci/config.yml` file with steps to deploy your app, so all you need to do is:

1. Go to the [CircleCi dashboard](https://app.circleci.com), find your newly-created repo, and click "Set up Project." Select "Use the `.circleci/config.yml` file in my repo," select the default `main` branch, and click "Set up Pipline." _(Only the repo admin can do this step.)_
2. Write some code, and push it to Github!

CircleCI will automatically build the project whenever you add a new commit to the repo, whether on main or other branches. We call these **"preview builds"**, and they go to our okta-protected preview page - available on URLs like this (where `[repo]` is the name of your repo and `[branch]` is the name of the branch you pushed to):

```
https://ig.in.ft.com/preview/ft-interactive/[repo]/[branch]/
```

Once you're ready to publish a project to the world, it's time to create a **live build**. To do that, tag the version with `npm version v1.0.0` then push it to git using `git push --follow-tags`. The three numbers `X.Y.Z` in the tag name roughly correspond to [semver](https://semver.org) version types, either `major` (for a big change), `minor` (for a new feature that's backwards-compatible), or `patch` (for a bugfix). You can also rely on NPM to determine the next version for you, by running `npm version [major/minor/patch]`.

Once you push a tag to Git, CircleCI will build the project for that tag and upload it to our live bucket, where you can reference it with IG Router. To create a public route, you'll paste a URL like this into IG Router:

```
https://djd-ig-live.s3.amazonaws.com/v3/ft-interactive/[repo]/HEAD/
```

This `HEAD` keyword is a shortcut: it means IG Router will _always_ serve the latest version live at `https://ig.ft.com/[your-slug]`. You can also replace `HEAD` with your specific version tag like `v1.0.0`, if you'd like to ensure _only_ that version is ever served via the public URL. (This can be helpful for quickly rolling back a bug: rather than wait for CircleCI to build, you can go into IG Router and just tweak the URL.)

Note that by default, tagged `live` publishes will run any tests specified in the `./test/qa` folder and require these to pass before deploying. It is _strongly suggested_ that you leave these tests in place, but you can disable them by replacing the `test` script in package.json with a no-op like `echo "Skipping tests"`.

More information on deploying Starter Kit can be found [here](https://github.com/Financial-Times/visual-data-playbook/blob/main/publishing-workflow/ig-page-workflow.md#deploying).

## What do I do with images/videos/other binary assets?

It's generally a bad idea to store big binary files in Git repos, however, we've added support for [git-lfs (Large File Support)](https://git-lfs.github.com/) and suggest you use that to store assets
that are critical to generating a build of your project. You'll be prompted to install git-lfs after cloning the repo if you don't have it already, please install it before committing large binary files.
The file types managed by git-lfs are all defined within `.gitattributes` in the project root; feel free to edit that if you need to adjust how large files are stored (e.g., adding a new file type).

To use such files in your project, import them in your code like you would a JavaScript module:

```jsx
import file from './image.png';

const MyImage = () => <img src={file} alt="My image" />;
```

The build process will automatically replace the imports with the correct path to the file. ✨

If you have other files you need to reference, but can't import (e.g. a large set of files with names that correspond to IDs), you can add them inside the `public/` folder.

## Understanding SSG (HTML pre-generation)

The starter-kit runs your React code twice: first, during the `npm run build` process, when it produces an `index.html` file that contains all your code.
Then, it runs again inside readers' browser, to _hydrate_ the static HTML with your react components and make them interactive.

This process means any browser-only code (e.g. anything that touches `window` or `document`) needs to run inside a `useEffect()` block, where it will be deferred to the client. Additionally,
you need to be sure to not conditionally render any elements depending on client — because the pre-rendered HTML must match the client-rendered text. (If you do this, you will see an "Hydration error"
in the browser console.)

Instead, consider controlling the rendering a server-side version in a `useState` variable and updating it using a `useEffect`.

```jsx
// DON'T do this:
{
  isClient && <div>{/* client-only stuff here */}</div>;
}

// This is better:
const [elements, setElements] = useState(null);
useEffect(() => {
  // This will only run once the client has hydrated
  setElements(<div>{/* client-only stuff here */}</div>);
});

return <div>{elements}</div>;
```

Alternatively, you can use the included `LazyLoad` helper in the `utils` directory, which will lazy-load any component and only render it on the client. This is both useful for components
that only run in the browser (e.g. WebGL or Canvas) and ones that are very large (e.g. complicated SVG diagrams) and low in the page. By lazy-loading components on the client, you reduce the size
of the initial JS bundle and speed up the initial rendering and loading of the page.

Usage of the `LazyLoad` looks like this:

```jsx
import LazyLoad from './util/LazyLoad';

<LazyLoad component={() => import('./MyComponent')} props={{ ... }} />
```

You can also optionally pass a custom loading message or component (displayed while waiting for the component to load) with the `loading` prop.

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
