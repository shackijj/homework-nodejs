const runCommand = require('../runCommand');
/**
 * @see https://git-scm.com/docs/git-ls-tree
 * @param {string} repoPath
 * @param {string} treeishId
 * @return {Promise}
 */
function lsTree (repoPath, treeishId) {
  return runCommand('git', [`--git-dir=${repoPath}/.git`, 'ls-tree', treeishId])
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
