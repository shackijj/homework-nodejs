const treeNavigation = require('../treeNavigation');
const show = require('../../utils/git/show');

function getBlobRequest (repoPath, {query: {commit, path}}, showFunc = show) {
  return showFunc(repoPath, commit, path)
    .then(blob => {
      const navigation = treeNavigation(path, commit);
      return { blob, navigation, commit, title: commit };
    });
}

module.exports = getBlobRequest;
