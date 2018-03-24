const runCommand = require('../runCommand');

/**
 * @param {string} repoPath
 * @param {string} commit
 * @param {string} path
 * @return {Promise}
 */
function getBlob (repoPath, commit, path) {
  return runCommand('git', [`--git-dir=${repoPath}/.git`, `show`, `${commit}:${path}`]);
};

module.exports = getBlob;
