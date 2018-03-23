const forEachRef = require('../../utils/git/forEachRef');

function getBranchesRequest (repoPath, refsPattern, forEachRefFunc = forEachRef) {
  return forEachRefFunc(repoPath, refsPattern)
    .then(refs =>
      refs.map(ref => ({
        name: ref,
        treeHref: `/tree?commit=${ref}`,
        logHref: `/log?ref=${ref}`
      }))
    );
}

module.exports = getBranchesRequest;
