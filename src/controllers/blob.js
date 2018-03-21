const treeNavigation = require('./treeNavigation');
const show = require('../utils/git/show');

function blob ({repoPath}) {
  return ({query: {commit, path}}, res) => {
    show(repoPath, commit, path)
      .then(blob => {
        const navigation = treeNavigation(path, commit);
        res.render('blob', { blob, navigation, branch: commit });
      })
      .catch(error => res.render('error', { error }));
  };
}

module.exports = blob;
