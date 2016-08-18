/* eslint-disable no-console, prefer-template */

import figures from 'figures';
import Git from 'nodegit';
import http from 'http';
import https from 'https';
import input from 'input';
import minimist from 'minimist';
import ora from 'ora';
import parseGitHubURL from 'parse-github-url';
import path from 'path';
import s3 from 's3';
import fs from 'fs';
import { cyan, green, red, yellow } from 'chalk';

process.on('unhandledRejection', error => {
  console.error('Unhandled rejection', error && error.stack);
  process.exit(1);
});

(async () => {
  const argv = minimist(process.argv.slice(2), {
    default: { confirm: false },
  });

  const projectRoot = path.resolve(__dirname, '..');
  const localDir = path.resolve(projectRoot, 'dist');
  const oneYear = 31556926;
  const oneMinute = 60;

  // fn to determine if a file is revved
  const isRevved = (() => {
    const revvedFileNames = Object.values(JSON.parse(
      fs.readFileSync(path.join(localDir, 'rev-manifest.json'), 'utf8'))
    );

    return name => revvedFileNames.indexOf(path.relative(localDir, name)) > -1;
  })();

  // increase socket pool size to improve bandwidth usage
  http.globalAgent.maxSockets = 20;
  https.globalAgent.maxSockets = 20;

  // gather some facts from git
  const { branchName, githubRepo } = await (async () => {
    const repository = await Git.Repository.open(projectRoot);
    const origin = await repository.getRemote('origin');
    const originURL = origin.url();

    const { repo, host } = parseGitHubURL(originURL);

    if (host !== 'github.com') {
      throw new Error(
        `Expected git remote "origin" to be a github.com URL, but it was: ${origin}`
      );
    }

    return {
      branchName: (await repository.head()).shorthand(),
      githubRepo: repo,
    };
  })();

  const isProd = (branchName === 'master');

  // decide where to upload to
  const bucketName = isProd ? process.env.BUCKET_NAME_PROD : process.env.BUCKET_NAME_DEV;
  const remotePrefix = isProd ? `v1/${githubRepo}/` : `v1/${githubRepo}/${branchName}/`;

  // tell user what we're going to sync
  console.log(
    cyan(`\nTo sync:\n`) +
    `  Local directory: ${yellow(path.relative(process.cwd(), localDir))}\n` +
    `  S3 Bucket: ${yellow(bucketName)}\n` +
    `  Remote prefix: ${yellow(remotePrefix)}\n`
  );

  // ensure needed env vars are set; give friendly explanation if not
  {
    const expectedEnvVars = [
      'BUCKET_NAME', 'AWS_KEY', 'AWS_SECRET', 'AWS_SECRET',
    ].map(name => `${name}_${isProd ? 'PROD' : 'DEV'}`);

    if (!expectedEnvVars.every(name => process.env[name])) {
      console.error(red(
        'Cannot continue without the following environment variables:\n  ' +
        expectedEnvVars.join('\n  ')
      ));
      process.exit(1);
    }
  }

  // establish upload parameters
  const params = {
    localDir,
    // deleteRemoved: true, // best not to use this in most cases

    // general params
    s3Params: {
      Bucket: bucketName,
      Prefix: remotePrefix,
      ACL: 'public-read',

      // you can include here any other options supported by putObject,
      // except Body and ContentLength
      // - see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    },

    // per-file params
    getS3Params: (localFile, stat, callback) => {
      const fileParams = {};

      const ext = path.extname(localFile);

      // use text/html for extensionless files (similar to gh-pages)
      if (ext === '') {
        fileParams.ContentType = 'text/html';
      }

      // set cache headers
      {
        const ttl = isRevved(localFile) ? oneYear : oneMinute;
        fileParams.CacheControl = `max-age=${ttl}`;
      }

      callback(null, fileParams);
    },
  };


  // await confirmation
  if (argv.confirm || await input.confirm('Continue?', { default: false })) {
    let uploadCount = 0;

    const spinner = ora({
      text: 'Deploying...',
      color: 'cyan',
    }).start();

    // make an S3 client instance
    const client = s3.createClient({
      s3Options: {
        accessKeyId: isProd ? process.env.AWS_KEY_PROD : process.env.AWS_KEY_DEV,
        secretAccessKey: isProd ? process.env.AWS_SECRET_PROD : process.env.AWS_SECRET_DEV,
        region: 'eu-west-1',
      },
    });

    const uploader = client.uploadDir(params);

    uploader.on('error', error => {
      console.error(`${red(figures.tick)} Failed to upload.`);
      console.error(error.stack);
      process.exit(1);
    });

    // uploader.on('fileUploadEnd', () => {
    //   uploadCount++;
    // });

    // uploader.on('progress', () => {
    //   spinner.text = `Uploaded ${uploadCount} files`;
    // });

    uploader.on('end', () => {
      spinner.stop();
      console.log(`${green(figures.tick)} Deployed.`);

      // NB. this is the only one of about 5 different S3 URL formats that supports
      // automatic index.html resolution
      console.log(cyan(`\n  http://${bucketName}.s3-website-eu-west-1.amazonaws.com/${remotePrefix}`));
    });
  }
})();
