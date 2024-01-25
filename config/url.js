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
      // (Usualy https://ig.ft.com/project-name)
      return articleUrl;
    case 'preview':
      // Infer preview builds from the CircleCI environment
      return `https://ig-preview.in.ft.com/preview/${org}/${project}/${branch}/`;
    case 'development':
    default:
      // Default to a simple root URL (e.g. for 'npm run start' or 'npm run preview')
      return '/';
  }
}
