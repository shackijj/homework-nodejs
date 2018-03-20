const createServer = require('../src/createServer');
const execShell = require('../src/utils/execShell');

const rp = require('request-promise');
const { expect } = require('chai');
const config = require('../config/test');

describe('App gets request on /', () => {
  const server = createServer(config);
  let response;
  before(() => {
    return execShell(`
      mkdir ${config.repoPath};
      cd ${config.repoPath};
      git init;
      git checkout -b "test1";
      touch file1.js;
      git add file1.js;
      git commit -m "First commit";
      git checkout -b "test2";
      touch file2.js;
      git add file2.js
      git commit -m "Second commit";
    `)
      .then(() => server.start())
      .then(() => rp(`http://${config.host}:${config.port}`))
      .then((html) => {
        response = html;
      });
  });

  after(() =>
    execShell(`rm -rf ${config.repoPath}`)
      .then(() => server.stop())
  );

  it('will return the list of branches', () => {
    const expected = [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '<title>Branches</title>',
      '</head>',
      '<body>',
      '<ul class="branch-list">',
      '<li class="branch-list__item">',
      '<div class="branch">test1</div>',
      '</li>',
      '<li class="branch-list__item">',
      '<div class="branch">test2</div>',
      '</li>',
      '</ul>',
      '</body>',
      '</html>'
    ].join('');
    expect(response).to.eql(expected);
  });
});
