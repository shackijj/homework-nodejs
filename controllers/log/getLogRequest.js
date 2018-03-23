const logForRef = require('../../utils/git/logForRef');

/**
 * @param {string} repoPath
 * @param {{
 *  query: {
 *    skip: (string|undefined),
 *    ref: (string|undefined)
 *  }
 * }} request
 * @param {number} count
 * @param {Function=} logForRefFunc
 * @return {Promise}
 */
function getLogRequest (repoPath, {query: {ref, skip}}, count, logForRefFunc = logForRef) {
  let _skip = parseInt(skip, 10);

  if (!Number.isInteger(_skip)) {
    _skip = 0;
  }

  return logForRefFunc(repoPath, ref, count, _skip)
    .then(({total, commits}) => {
      let newer = '';
      let older = '';
      if (total > _skip + count) {
        older = `/log?ref=${ref}&skip=${_skip + count}`;
      }
      if (_skip - count >= 0) {
        newer = `/log?ref=${ref}&skip=${_skip - count}`;
      }
      return {
        pagination: { newer, older },
        commits,
        title: ref
      };
    });
}

module.exports = getLogRequest;
