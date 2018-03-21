const execShell = require('../execShell');

/**
 * @param {string} repoPath
 * @param {string} refPath
 * @return {Promise}
 */
function logForRef (repoPath, refPath) {
  const cmd = `
    cd ${repoPath};
    REV_HASH=$(git show-ref --hash ${refPath});
    git --no-pager log $REV_HASH --pretty='format:%s;%H;%aI'
  `;
  return execShell(cmd)
    .then((stdout) => {
      return stdout
        .trim()
        .split('\n')
        .map((line) => {
          const [subject, hash, date] = line.split(';');
          return { subject, hash, date };
        });
    });
};

module.exports = logForRef;
