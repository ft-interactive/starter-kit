const { resolve, dirname } = require('path');

let runOnce = false;

module.exports.getVVCRoot = () => {
  let vvcRoot = false;

  try {
    vvcRoot = resolve(dirname(require.resolve('@financial-times/vvc/package.json')), 'src');
  } catch (e) {
    if (!runOnce) {
      console.info(
        'VVC not installed. To install, ensure you have your GitHub SSH key added to the SSH agent (https://docs.github.com/en/enterprise/2.17/user/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent), then npm install'
      );
      runOnce = true;
    }
  }

  return vvcRoot;
};
