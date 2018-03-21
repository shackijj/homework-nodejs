const createServer = require('../createServer');
const execShell = require('../utils/execShell');
const logForRef = require('../utils/git/logForRef');
const { expect } = require('chai');
const config = require('../config/test');

describe('App gets request on /log', () => {
  const server = createServer(config);
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
      server.request(`/log?ref=refs/heads/test2`)
        .then((html) => {
          response = html;
        })
        .then(() => logForRef(config.repoPath, 'refs/heads/test2'))
        .then((result) => {
          commits = result;
        })
    );
    it('will return the list of commits for test2 branch ', () => {
      /* eslint-disable indent */
      const expected = [
        '<!DOCTYPE html>',
        '<html>',
          '<head>',
            '<title>Log</title>',
          '</head>',
          '<body>',
            '<div class="log-page">',
              '<h1 class="log-page__branch-name">refs/heads/test2</h1>',
              '<ul class="commits-list">',
                '<li class="commits-list__item">',
                  '<div class="commit">',
                    `<span class="commit__date">${commits[0].date}</span>`,
                    '<span class="commit__subject">Second commit</span>',
                    `<a class="commit__tree" href="/tree?commit=${commits[0].hash}">tree</a>`,
                  '</div>',
                '</li>',
                '<li class="commits-list__item">',
                  '<div class="commit">',
                    `<span class="commit__date">${commits[1].date}</span>`,
                    '<span class="commit__subject">First commit</span>',
                    `<a class="commit__tree" href="/tree?commit=${commits[1].hash}">tree</a>`,
                  '</div>',
                '</li>',
              '</ul>',
            '</div>',
          '</body>',
        '</html>'
      ].join('');
      /* eslint-enable indent */
      expect(response).to.equal(expected);
    });
  });

  describe('given that log is requested for refs/heads/test1', () => {
    let response;
    let commits;
    before(() =>
      server.request(`/log?ref=refs/heads/test1`)
        .then((html) => {
          response = html;
        })
        .then(() => logForRef(config.repoPath, 'refs/heads/test1'))
        .then((result) => {
          commits = result;
        })
    );
    it('will return the list of commits for test1 branch ', () => {
      /* eslint-disable indent */
      const expected = [
        '<!DOCTYPE html>',
        '<html>',
          '<head>',
            '<title>Log</title>',
          '</head>',
          '<body>',
            '<div class="log-page">',
            '<h1 class="log-page__branch-name">refs/heads/test1</h1>',
              '<ul class="commits-list">',
                '<li class="commits-list__item">',
                  '<div class="commit">',
                    `<span class="commit__date">${commits[0].date}</span>`,
                    '<span class="commit__subject">First commit</span>',
                    `<a class="commit__tree" href="/tree?commit=${commits[0].hash}">tree</a>`,
                  '</div>',
                '</li>',
              '</ul>',
            '</div>',
          '</body>',
        '</html>'
      ].join('');
       /* eslint-enable indent */
      expect(response).to.equal(expected);
    });
  });
});
