// eslint-disable-next-line no-unused-vars
export default function getUrl(
  articleUrl,
  environment = 'development',
  org = process.env.CIRCLE_PROJECT_USERNAME,
  project = process.env.CIRCLE_PROJECT_REPONAME,
  branch = process.env.CIRCLE_BRANCH
) {
  switch (environment) {
    case 'production':
      // Prod builds use the canonical URL
      // (Usually https://ig.ft.com/project-name)
      if (!articleUrl)
        throw new Error("Production builds require a 'url' value in config/article.js.");

      return articleUrl;
    case 'preview':
      if (!org || !project || !branch)
        throw new Error(
          'Preview builds require CircleCI env CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME, and CIRCLE_BRANCH.'
        );

      // Infer preview builds from the CircleCI environment
      return `https://ig.in.ft.com/preview/${org}/${project}/${branch}/`;
    case 'development':
    default:
      // Default to a simple root URL (e.g. for 'npm run start' or 'npm run preview')
      return '/';
  }
}
