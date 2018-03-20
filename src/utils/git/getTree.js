const execShell = require('../execShell');

/**
 * @see https://git-scm.com/docs/git-ls-tree
 * @param {string} repoPath
 * @param {string} commitHash
 * @param {string} path
 * @return {Promise}
 */
function getTree (repoPath, commitHash, path = '') {
  const cmd = `
    cd ${repoPath};
    git ls-tree ${commitHash}:${path};
  `;
  return execShell(cmd)
    .then(stdout => stdout
      .trim()
      .split('\n')
      .map(line => {
        const [mode, type, hash, name] = line.split(/\s+/);
        return { mode, type, hash, name };
      })
    );
};

module.exports = getTree;
