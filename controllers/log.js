const logForRef = require('../utils/git/logForRef');
/**
 *
 * @param {{repoPath: string}} config
 * @return {Promise}
 */
function log ({repoPath}) {
  return ({query: {ref}}, res) => {
    logForRef(repoPath, ref)
      .then(commits => res.render('log', { commits, branch: ref}))
      .catch(error => res.render('error', { error }));
  };
};

module.exports = log;
