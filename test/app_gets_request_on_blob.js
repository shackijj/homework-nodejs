const createServer = require('../src/createServer');
const execShell = require('../src/utils/execShell');
const rp = require('request-promise');
const { expect } = require('chai');
const config = require('../config/test');

describe('App gets request on /blob', () => {
  const server = createServer(config);

  before(() => {
    return execShell(`
      mkdir ${config.repoPath};
      cd ${config.repoPath};
      git init;
      git checkout -b "test";
      mkdir dir;
      touch dir/file-in-dir;
      printf "file-in-dir" > dir/file-in-dir;
      git add dir/file-in-dir;
      touch file;
      printf "file" > file;
      git add file;
      git commit -m "First Commit";
    `)
      .then(() => server.start());
  });

  after(() =>
    execShell(`rm -rf ${config.repoPath}`)
      .then(() => server.stop())
  );
  describe('given that "commit" and "path" params are given', () => {
    let response;
    before(() =>
      rp(`http://${config.host}:${config.port}/blob?commit=refs/heads/test&path=file`)
        .then((html) => {
          response = html;
        })
    );
    it('will return content of file', () => {
      /* eslint-disable indent */
      const expected = [
        '<!DOCTYPE html>',
          '<html>',
          '<head>',
          '<title>Blob</title>',
          '</head>',
          '<body>',
            '<div class="blob-page">',
              '<h1 class="blob-page__title">refs/heads/test</h1>',
              '<nav class="blob-page__navigation navigation">',
                '<a class="navigation__link" href="/tree?commit=refs/heads/test">root</a>',
                '<a class="navigation__link" href="/tree?commit=refs/heads/test&amp;path=file">file</a>',
              '</nav>',
              '<div class="blob">',
                '<pre class="blob__content">file</pre>',
              '</div>',
            '</div>',
          '</body>',
        '</html>'
      ].join('');
      /* eslint-enable indent */

      expect(response).to.equal(expected);
    });
  });

  describe('given that the requested blob is in subdirectory', () => {
    let response;
    before(() =>
      rp(`http://${config.host}:${config.port}/blob?commit=refs/heads/test&path=dir/file-in-dir`)
        .then((html) => {
          response = html;
        })
    );
    it('will return content of the file and the navigation', () => {
      /* eslint-disable indent */
      const expected = [
        '<!DOCTYPE html>',
          '<html>',
          '<head>',
          '<title>Blob</title>',
          '</head>',
          '<body>',
            '<div class="blob-page">',
              '<h1 class="blob-page__title">refs/heads/test</h1>',
              '<nav class="blob-page__navigation navigation">',
                '<a class="navigation__link" href="/tree?commit=refs/heads/test">root</a>',
                '<a class="navigation__link" href="/tree?commit=refs/heads/test&amp;path=dir">dir</a>',
                '<a class="navigation__link" href="/tree?commit=refs/heads/test&amp;path=dir/file-in-dir">file-in-dir</a>',
              '</nav>',
              '<div class="blob">',
                '<pre class="blob__content">file-in-dir</pre>',
              '</div>',
            '</div>',
          '</body>',
        '</html>'
      ].join('');
      /* eslint-enable indent */

      expect(response).to.equal(expected);
    });
  });
});
