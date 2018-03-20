const execShell = require('../execShell');

/**
 * @param {string} repoPath
 * @param {string} branch
 * @param {string} path
 * @return {Promise}
 */
function getBlob (repoPath, branch, path) {
  const cmd = `
    cd ${repoPath};
    git show $(cat .git/${branch}):${path};
  `;
  return execShell(cmd);
};

module.exports = getBlob;
