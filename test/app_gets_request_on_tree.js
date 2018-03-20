const createServer = require('../src/createServer');
const execShell = require('../src/utils/execShell');
const config = require('../config/test.json');
const getTree = require('../src/utils/git/getTree');

const rp = require('request-promise');
const { expect } = require('chai');

describe('App gets request on /tree', () => {
  const server = createServer(config);
  let response;
  let commitHash;
  let dirObj;
  let fileObj;
  let fileInDirObj;
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
      })
      .then(() => server.start())
      .then(() => getTree(config.repoPath, commitHash))
      .then((objects) => {
        dirObj = objects.find((object) => object.path === 'dir');
        fileObj = objects.find((object) => object.path === 'file');
      })
      .then(() => getTree(config.repoPath, dirObj.hash))
      .then((objects) => {
        fileInDirObj = objects.find((object) => object.path === 'file-in-dir');
      });
  });

  after(() =>
    execShell(`rm -rf ${config.repoPath}`)
      .then(() => server.stop())
  );

  describe('given that requested object is a tree and "path" param is not given', () => {
    let response;
    before(() =>
      rp(`http://${config.host}:${config.port}/tree?hash=${commitHash}&branch=refs/heads/test`)
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
                  `<a class="tree-object__link" href="/tree?hash=${dirObj.hash}&amp;path=dir&amp;branch=refs/heads/test">dir</a>`,
                '</div>',
              '</li>',
              '<li class="tree-list__item">',
                '<div class="blob-object">',
                  `<a class="blob-object__link" href="/blob?hash=${fileObj.hash}&amp;path=file&amp;branch=refs/heads/test">file</a>`,
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
      rp(`http://${config.host}:${config.port}/tree?hash=${dirObj.hash}&path=dir&branch=refs/heads/test`)
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
                  `<a class="link-back__link" href="/tree?branch=refs/heads/test&amp;path=">..</a>`,
                '</div>',
              '</li>',
              '<li class="tree-list__item">',
                '<div class="blob-object">',
                  `<a class="blob-object__link" href="/blob?hash=${fileInDirObj.hash}&amp;path=dir/file-in-dir&amp;branch=refs/heads/test">file-in-dir</a>`,
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