const execShell = require('../execShell');

/**
 * @see https://git-scm.com/docs/git-ls-tree
 * @param {string} repoPath
 * @param {string} commitHash
 * @param {string} path
 * @return {Promise}
 */
function getTree (repoPath, commitHash, treePath = '') {
  const cmd = `
    cd ${repoPath};
    git ls-tree ${commitHash}:${treePath};
  `;
  return execShell(cmd)
    .then(stdout => {
      const result = stdout
        .trim()
        .split('\n')
        .map(line => {
          const [mode, type, hash, path] = line.split(/\s+/);
          return { type, path, commit: hash };
        });

      if (treePath) {
        const path = treePath
          .split('/')
          .filter(item => item !== '')
          .slice(0, -1)
          .join('/');

        result.unshift({
          type: 'link-back',
          path,
          commit: commitHash
        });
      }
      return result;
    });
};

module.exports = getTree;
