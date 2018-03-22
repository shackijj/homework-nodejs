const execShell = require('../../utils/execShell');

function createTestRepo ({repoPath}) {
  return execShell(`
    rm -rf ${repoPath};
    mkdir ${repoPath};
    cd ${repoPath};
    git init;
    git checkout -b "test1";
    touch file.js;
    printf "File1 Branch: test1" > file.js
    mkdir dir1;
    touch dir1/file1.js;
    git add .;
    git commit -m "First commit";
    git checkout -b "test2";
    printf "File1 Branch: test2" > file.js
    mkdir -p dir2/dir3
    touch dir2/dir3/file3.js;
    printf "File3.js" > dir2/dir3/file3.js;
    git add .
    git commit -m "Second commit";`);
}

module.exports = createTestRepo;
