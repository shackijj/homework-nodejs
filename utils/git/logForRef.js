const execShell = require('../execShell');

/**
 * @param {string} repoPath
 * @param {string} ref
 * @param {nummber} count
 * @param {number} skip
 * @return {Promise}
 */
function logForRef (repoPath, ref, count = 30, skip = 0) {
  const getCommits = `
    git --git-dir=${repoPath}/.git --no-pager log ${ref} --pretty='format:%s;%H;%ai' -n ${count} --skip=${skip};
  `;

  const getCount = `
    cd ${repoPath};
    git rev-list --count ${ref};
  `;
  return Promise.all([execShell(getCommits), execShell(getCount)])
    .then(([getCommitOutput, getCountOutput]) => {
      const commits = getCommitOutput
        .trim()
        .split('\n')
        .map((line) => {
          const [subject, hash, date] = line.split(';');
          return { subject, hash, date };
        });

      const total = parseInt(getCountOutput, 10);
      return { commits, total };
    });
};

module.exports = logForRef;
