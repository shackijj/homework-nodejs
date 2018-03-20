const execShell = require('../execShell');

/**
 * @param {string} repoPath
 * @param {string} refPath
 * @return {Promise}
 */
function getBranchCommits (repoPath, refPath) {
  const cmd = `
    cd ${repoPath};
    REV_HASH=$(git show-ref --hash ${refPath});
    git log $REV_HASH --pretty='format:%s;%H'
  `;
  return execShell(cmd)
    .then((stdout) => {
      return stdout
        .trim()
        .split('\n')
        .map((line) => {
          const [subject, hash] = line.split(';');
          return { subject, hash };
        });
    });
};

module.exports = getBranchCommits;
