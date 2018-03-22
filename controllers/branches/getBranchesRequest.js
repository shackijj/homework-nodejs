const forEachRef = require('../../utils/git/forEachRef');

function getBranchesRequest (repoPath, forEachRefFunc = forEachRef) {
  return forEachRefFunc(repoPath)
    .then(refs =>
      refs.map(ref => ({
        name: ref,
        treeHref: `/tree?commit=refs/heads/${ref}`,
        logHref: `/log?ref=refs/heads/${ref}`
      }))
    );
}

module.exports = getBranchesRequest;
