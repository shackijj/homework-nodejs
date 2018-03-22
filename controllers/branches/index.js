const getBranchesRequest = require('./getBranchesRequest');

/**
 *
 * @param {{repoPath: string}} config
 */
function branches ({repoPath}) {
  return (req, res) => {
    getBranchesRequest(repoPath)
      .then(branches => res.render('branches', { branches }))
      .catch(error => res.render('error', { error }));
  };
};

module.exports = branches;
