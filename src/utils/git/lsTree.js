const execShell = require('../execShell');
/**
 * @see https://git-scm.com/docs/git-ls-tree
 * @param {string} repoPath
 * @param {string} treeishId
 * @return {Promise}
 */
function lsTree (repoPath, treeishId) {
  const cmd = `
    cd ${repoPath};
    git ls-tree ${treeishId};
  `;
  return execShell(cmd)
    .then(stdout => stdout
      .trim()
      .split('\n')
      .map(line => {
        const [mode, type, hash, path] = line.split(/\s+/);
        return { type, path, hash, mode };
      })
    );
};

module.exports = lsTree;
