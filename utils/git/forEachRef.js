const runCommand = require('../runCommand');

/**
 * @param {string} repoPath
 * @param {string} refsPattern
 * @return {Promise}
 */
function forEachRef (repoPath, refsPattern) {
  return runCommand('git', [`--git-dir=${repoPath}/.git`, `for-each-ref`, `--format=%(refname:short)`, refsPattern])
    .then((stdout) => stdout.trim().split('\n'));
};

module.exports = forEachRef;
