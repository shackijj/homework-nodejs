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
    /* eslint-disable indent */
    const expected = [
      '<!DOCTYPE html>',
      '<html>',
        '<head>',
          '<title>Branches</title>',
        '</head>',
        '<body>',
          '<ul class="branch-list">',
            '<li class="branch-list__item">',
              '<div class="branch">',
                '<span class="branch__name">test1</span>',
                '<a class="branch__log" href="/log?ref=refs/heads/test1">log</a>',
                '<a class="branch__tree" href="/tree?commit=refs/heads/test1">tree</a>',
              '</div>',
            '</li>',
            '<li class="branch-list__item">',
              '<div class="branch">',
                '<span class="branch__name">test2</span>',
                '<a class="branch__log" href="/log?ref=refs/heads/test2">log</a>',
                '<a class="branch__tree" href="/tree?commit=refs/heads/test2">tree</a>',
              '</div>',
            '</li>',
          '</ul>',
        '</body>',
      '</html>'
    ].join('');
    /* eslint-enable indent */
    expect(response).to.eql(expected);
  });
});
