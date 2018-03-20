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
    .then(stdout => {
      const result = stdout
        .trim()
        .split('\n')
        .map(line => {
          const [mode, type, hash, name] = line.split(/\s+/);
          return { type, name };
        });

      if (path) {
        const name = path
          .split('/')
          .filter(item => item !== '')
          .slice(0, -1)
          .join('/');

        result.unshift({
          type: 'link-back',
          name
        });
      }
      return result;
    });
};

module.exports = getTree;
