const execShell = require('../execShell');

/**
 * @param {string} repoPath
 * @param {string} refPath
 * @return {Promise}
 */
function getBranchCommits (repoPath, refPath) {
  const cmd = `
    cd ${repoPath};
    REV_HASH=$(git show-ref --hash ${refPath});
    git log $REV_HASH --pretty='format:%s'
  `;
  return execShell(cmd)
    .then((stdout) => stdout.trim().split('\n'));
};

module.exports = getBranchCommits;
