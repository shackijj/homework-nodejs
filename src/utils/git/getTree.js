const execShell = require('../execShell');

/**
 * @see https://git-scm.com/docs/git-ls-tree
 * @param {string} repoPath
 * @param {string} id
 * @param {string} path
 * @param {string} branch
 * @return {Promise}
 */
function getTree (repoPath, id, branch, treePath = '') {
  const lsTreeOptions = id ? id : `$(cat .git/${branch}):${treePath}`;
  const cmd = `
    cd ${repoPath};
    git ls-tree ${lsTreeOptions};
  `;
  return execShell(cmd)
    .then(stdout => {
      const result = stdout
        .trim()
        .split('\n')
        .map(line => {
          const [mode, type, hash, path] = line.split(/\s+/);
          return {
            type,
            path: treePath ? `${treePath}/${path}` : path,
            name: path,
            hash,
            branch
          };
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
          branch
        });
      };
      return result;
    });
};

module.exports = getTree;
