const lsTree = require('../../utils/git/lsTree');
/**
 *
 * @param {string} repoPath
 * @param {string} id
 * @param {string} commit
 * @param {string} treePath
 */
function getTreeViewModel (repoPath, id, commit, treePath = '', lsTreeFunc = lsTree) {
  const lsTreeOptions = id ? id : `${commit}:${treePath}`;
  return lsTreeFunc(repoPath, lsTreeOptions)
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

module.exports = getTreeViewModel;
