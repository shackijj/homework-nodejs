const lsTree = require('../utils/git/lsTree');
const treeNavigation = require('./treeNavigation');

/**
 *
 * @param {string} repoPath
 * @param {string} id
 * @param {string} commit
 * @param {string} treePath
 */
function getTree (repoPath, id, commit, treePath = '') {
  const lsTreeOptions = id ? id : `${commit}:${treePath}`;
  return lsTree(repoPath, lsTreeOptions)
    .then(treeObjects => {
      const objects = treeObjects
        .map(({type, hash, path}) => {
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

function tree ({repoPath}) {
  return ({query: {hash, commit, path}}, res) => {
    getTree(repoPath, hash, commit, path)
      .then(({objects, navigation}) => {
        res.render('tree', { objects, navigation, commit });
      })
      .catch(error => res.render('error', { error }));
  };
}

module.exports = tree;
