const execShell = require('../execShell');

/**
 * @param {string} repoPath
 * @param {string} refsPattern
 * @return {Promise}
 */
function forEachRef (repoPath, refsPattern) {
  const cmd = `
    cd ${repoPath};
    git for-each-ref --format='%(refname:short)' ${refsPattern};
  `;
  return execShell(cmd)
    .then((stdout) => stdout.trim().split('\n'));
};

module.exports = forEachRef;
