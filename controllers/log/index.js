const getLogRequest = require('./getLogRequest');
/**
 *
 * @param {{repoPath: string, paginationCount: number}} config
 * @return {Promise}
 */
function log ({repoPath, paginationCount}) {
  return (req, res) => {
    return getLogRequest(repoPath, req, paginationCount)
      .then(result => res.render('log', result))
      .catch(error => res.render('error', { error }));
  };
};

module.exports = log;
