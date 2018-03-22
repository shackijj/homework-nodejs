const getTreeViewModel = require('./getTreeViewModel');
const treeNavigation = require('../treeNavigation');

function tree ({repoPath}) {
  return ({query: {hash, commit, path}}, res) => {
    getTreeViewModel(repoPath, hash, commit, path)
      .then((objects) => {
        const navigation = path ? treeNavigation(path, commit) : [];
        res.render('tree', { objects, navigation, commit, title: commit });
      })
      .catch(error => res.render('error', { error }));
  };
}

module.exports = tree;
