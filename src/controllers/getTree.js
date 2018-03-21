const execShell = require('../utils/execShell');
const treeNavigation = require('./treeNavigation');
/**
 * @see https://git-scm.com/docs/git-ls-tree
 * @param {string} repoPath
 * @param {string} id
 * @param {string} path
 * @param {string} commit
 * @return {Promise}
 */
function getTree (repoPath, id, commit, treePath = '') {
  const lsTreeOptions = id ? id : `${commit}:${treePath}`;
  const cmd = `
    cd ${repoPath};
    git ls-tree ${lsTreeOptions};
  `;
  return execShell(cmd)
    .then(stdout => {
      const objects = stdout
        .trim()
        .split('\n')
        .map(line => {
          const [mode, type, hash, path] = line.split(/\s+/);
          return {
            type,
            path: treePath ? `${treePath}/${path}` : path,
            name: path,
            hash,
            commit
          };
        });

      if (treePath) {
        const path = treePath
          .split('/')
          .filter(item => item !== '')
          .slice(0, -1)
          .join('/');

        objects.unshift({
          type: 'link-back',
          path,
          commit
        });
      };

      return {
        objects,
        navigation: treePath ? treeNavigation(treePath, commit) : []
      };
    });
};

module.exports = getTree;
