// eslint-disable-next-line no-unused-vars
export default function getUrl(articleUrl, environment = 'development') {
  if (process.env.CIRCLECI) {
    // These env variables come from CircleCI
    const project = process.env.CIRCLE_PROJECT_REPONAME;
    const branch = process.env.CIRCLE_BRANCH;
    if (!project || !branch)
      throw new Error('Detected CIRCLECI env, but CIRCLE_REPO_NAME and CIRCLE_BRANCH are missing.');

    // This env variable is used by g-deploy
    const bucket = process.env.BUCKET_NAME_PROD;
    if (!bucket) throw new Error('The BUCKET_NAME_PROD variable (used by g-deploy) is required.');

    if (articleUrl && branch === 'main') {
      // Use the canonical URL from article.js if it exists
      // (usually https://ig.ft.com/some-project)
      return articleUrl;
    }

    // Otherwise infer the deployed test URL from the environment
    return `http://${bucket}.s3-website-eu-west-1.amazonaws.com/v2/ft-interactive/${project}/${branch}/`;
  }

  // Default to a simple root URL (e.g. for 'npm run start' or 'npm run preview')
  return '/';
}
