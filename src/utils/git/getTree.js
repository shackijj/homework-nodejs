const execShell = require('../execShell');

/**
 * @see https://git-scm.com/docs/git-ls-tree
 * @param {string} repoPath
 * @param {string} id
 * @param {string} path
 * @param {string} branch
 * @return {Promise}
 */
function getTree (repoPath, id, branch, treePath = '') {
  const lsTreeOptions = id ? id : `${branch}:${treePath}`;
  const cmd = `
    cd ${repoPath};
    git ls-tree ${lsTreeOptions};
  `;
  return execShell(cmd)
    .then(stdout => {
      const objects = stdout
        .trim()
        .split('\n')
        .map(line => {
          const [mode, type, hash, path] = line.split(/\s+/);
          return {
            type,
            path: treePath ? `${treePath}/${path}` : path,
            name: path,
            hash,
            branch
          };
        });

      if (treePath) {
        const path = treePath
          .split('/')
          .filter(item => item !== '')
          .slice(0, -1)
          .join('/');

        objects.unshift({
          type: 'link-back',
          path,
          branch
        });
      };

      const navigation = [];
      if (treePath) {
        const dirs = treePath
          .split('/')
          .filter(item => item !== '')
          .forEach((dir, idx, ary) => {
            const path = (idx > 0 ? ary[idx - 1] + '/' : '')  + dir ;
            navigation.push({
              name: dir,
              href: `/tree?branch=${branch}&path=${path}`
            });
          });
        navigation.unshift({
          name: 'root',
          href: `/tree?branch=${branch}`
        });
      }
      return { objects, navigation };
    });
};

module.exports = getTree;
