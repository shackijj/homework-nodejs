const runCommand = require('../runCommand');

/**
 * @param {string} repoPath
 * @param {string} ref
 * @param {number} count
 * @param {number} skip
 * @return {Promise}
 */
function logForRef (repoPath, ref, count = 30, skip = 0) {
  const getCommits = runCommand('git', [`--git-dir=${repoPath}/.git`, '--no-pager', 'log', ref, `--pretty=format:%s;%H;%ai`, '-n', count, '--skip', skip]);
  const getCount = runCommand('git', [`--git-dir=${repoPath}/.git`, 'rev-list', ref, '--count']);

  return Promise.all([getCommits, getCount])
    .then(([getCommitOutput, getCountOutput]) => {
      const commits = getCommitOutput
        .trim()
        .split('\n')
        .map((line) => {
          const [subject, hash, date] = line.split(';');
          return { subject, hash, date };
        });

      console.log(getCountOutput);
      const total = parseInt(getCountOutput, 10);
      return { commits, total };
    });
};

module.exports = logForRef;
