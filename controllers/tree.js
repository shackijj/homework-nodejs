const lsTree = require('../utils/git/lsTree');
const treeNavigation = require('./treeNavigation');

/**
 *
 * @param {string} repoPath
 * @param {string} id
 * @param {string} commit
 * @param {string} treePath
 */
function getTreeViewModel (repoPath, id, commit, treePath = '') {
  const lsTreeOptions = id ? id : `${commit}:${treePath}`;
  return lsTree(repoPath, lsTreeOptions)
    .then(treeObjects => {
      const objects = treeObjects
        .map(({type, hash, path}) => {
          const linkPath = treePath ? `${treePath}/${path}` : path;
          return {
            type,
            name: path,
            href: `/${type}?hash=${hash}&path=${linkPath}&commit=${commit}`
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
          href: `/tree?commit=${commit}&path=${path}`
        });
      };

      return objects;
    });
};

function tree ({repoPath}) {
  return ({query: {hash, commit, path}}, res) => {
    getTreeViewModel(repoPath, hash, commit, path)
      .then((objects) => {
        const navigation = path ? treeNavigation(path, commit) : [];
        res.render('tree', { objects, navigation, commit });
      })
      .catch(error => res.render('error', { error }));
  };
}

module.exports = tree;
