const createServer = require('../src/createServer');
const execShell = require('../src/utils/execShell');
const getBranchCommits = require('../src/utils/git/getBranchCommits');
const rp = require('request-promise');
const { expect } = require('chai');
const config = require('../config/test');

describe('App gets request on /log', () => {
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
      .then(() => server.start());
  });

  after(() =>
    execShell(`rm -rf ${config.repoPath}`)
      .then(() => server.stop())
  );

  describe('given that log is requested for refs/heads/test2', () => {
    let response;
    let commits;
    before(() =>
      rp(`http://${config.host}:${config.port}/log?ref=refs/heads/test2`)
        .then((html) => {
          response = html;
        })
        .then(() => getBranchCommits(config.repoPath, 'refs/heads/test2'))
        .then((result) => {
          commits = result;
        })
    );
    it('will return the list of commits for test2 branch ', () => {
      const expected = [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<title>Log</title>',
        '</head>',
        '<body>',
        '<ul class="commits-list">',
        '<li class="commits-list__item">',
        '<div class="commit">',
        '<span class="commit__subject">Second commit</span>',
        `<a class="commit__tree" href="/tree?branch=${commits[0].hash}">tree</a>`,
        '</div>',
        '</li>',
        '<li class="commits-list__item">',
        '<div class="commit">',
        '<span class="commit__subject">First commit</span>',
        `<a class="commit__tree" href="/tree?branch=${commits[1].hash}">tree</a>`,
        '</div>',
        '</li>',
        '</ul>',
        '</body>',
        '</html>'
      ].join('');
      expect(response).to.equal(expected);
    });
  });

  describe('given that log is requested for refs/heads/test1', () => {
    let response;
    let commits;
    before(() =>
      rp(`http://${config.host}:${config.port}/log?ref=refs/heads/test1`)
        .then((html) => {
          response = html;
        })
        .then(() => getBranchCommits(config.repoPath, 'refs/heads/test1'))
        .then((result) => {
          commits = result;
        })
    );
    it('will return the list of commits for test1 branch ', () => {
      const expected = [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<title>Log</title>',
        '</head>',
        '<body>',
        '<ul class="commits-list">',
        '<li class="commits-list__item">',
        '<div class="commit">',
        '<span class="commit__subject">First commit</span>',
        `<a class="commit__tree" href="/tree?branch=${commits[0].hash}">tree</a>`,
        '</div>',
        '</li>',
        '</ul>',
        '</body>',
        '</html>'
      ].join('');
      expect(response).to.equal(expected);
    });
  });
});
