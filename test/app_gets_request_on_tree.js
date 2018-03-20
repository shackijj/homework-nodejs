const createServer = require('../src/createServer');
const execShell = require('../src/utils/execShell');
const config = require('../config/test.json');

const rp = require('request-promise');
const { expect } = require('chai');

describe('App gets request on /tree', () => {
  const server = createServer(config);
  let response;
  let commitHash;

  before(() => {
    return execShell(`
      mkdir ${config.repoPath};
      cd ${config.repoPath};
      git init;
      git checkout -b "test";
      mkdir dir;
      touch dir/file-in-dir;
      touch file;
      git add dir/file-in-dir;
      git add file;
      git commit -m "First Commit";
    `)
      .then(() => execShell(`
        cd ${config.repoPath};
        git rev-parse HEAD;
      `))
      .then((stdout) => {
        commitHash = stdout.trim();
        server.start();
      });
  });

  after(() =>
    execShell(`rm -rf ${config.repoPath}`)
      .then(() => server.stop())
  );

  describe('given that requested object is a tree and "path" param is not given', () => {
    let response;
    before(() =>
      rp(`http://${config.host}:${config.port}/tree?commit=${commitHash}`)
        .then((html) => {
          response = html;
        })
    );
    it('will show list of files and directories', () => {
      /* eslint-disable indent */
      const expected = [
        '<!DOCTYPE html>',
          '<html>',
          '<head>',
          '<title>Tree</title>',
          '</head>',
          '<body>',
            '<ul class="tree-list">',
              '<li class="tree-list__item">',
                '<div class="tree-object">',
                  `<a class="tree-object__link" href="/tree?commit=${commitHash}&amp;path=dir">dir</a>`,
                '</div>',
              '</li>',
              '<li class="tree-list__item">',
                '<div class="blob-object">',
                  `<a class="blob-object__link" href="/blob?commit=${commitHash}&amp;path=file">file</a>`,
                '</div>',
              '</li>',
            '</ul>',
          '</body>',
        '</html>'
      ].join('');
      /* eslint-enable indent */

      expect(response).to.equal(expected);
    });
  });

  describe('given that requested object is a tree and the path param is "dir"', () => {
    let response;
    before(() =>
      rp(`http://${config.host}:${config.port}/tree?commit=${commitHash}&path=dir`)
        .then((html) => {
          response = html;
        })
    );
    it('will show list of files amd directories inside dir folder and link to come upper in the tree', () => {
      /* eslint-disable indent */
      const expected = [
        '<!DOCTYPE html>',
          '<html>',
          '<head>',
          '<title>Tree</title>',
          '</head>',
          '<body>',
            '<ul class="tree-list">',
              '<li class="tree-list__item">',
                '<div class="link-back">',
                  `<a class="link-back__link" href="/tree?commit=${commitHash}&amp;path=">..</a>`,
                '</div>',
              '</li>',
              '<li class="tree-list__item">',
                '<div class="blob-object">',
                  `<a class="blob-object__link" href="/blob?commit=${commitHash}&amp;path=file-in-dir">file-in-dir</a>`,
                '</div>',
              '</li>',
            '</ul>',
          '</body>',
        '</html>'
      ].join('');
      /* eslint-enable indent */

      expect(response).to.equal(expected);
    });
  });
});
