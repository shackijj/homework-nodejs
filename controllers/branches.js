const forEachRef = require('../utils/git/forEachRef');

/**
 *
 * @param {{repoPath: string}} config
 */
function branches ({repoPath}) {
  return (req, res) => {
    forEachRef(repoPath)
      .then(branches => res.render('branches', { branches }))
      .catch(error => res.render('error', { error }));
  };
};

module.exports = branches;
