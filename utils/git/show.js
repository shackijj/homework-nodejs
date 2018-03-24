const execShell = require('../execShell');

/**
 * @param {string} repoPath
 * @param {string} commit
 * @param {string} path
 * @return {Promise}
 */
function getBlob (repoPath, commit, path) {
  const cmd = `
    git --git-dir=${repoPath}/.git show ${commit}:${path};
  `;
  return execShell(cmd);
};

module.exports = getBlob;
