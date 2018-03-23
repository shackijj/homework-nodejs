const getBranchesRequest = require('./getBranchesRequest');

/**
 *
 * @param {{repoPath: string, refsPattern: string}} config
 */
function branches ({repoPath, refsPattern}) {
  return (req, res) => {
    getBranchesRequest(repoPath, refsPattern)
      .then(branches => res.render('branches', { branches, title: 'branches' }))
      .catch(error => res.render('error', { error }));
  };
};

module.exports = branches;
