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
      touch file;
      printf "FooBar" > file;
      git add dir/file-in-dir;
      git add file;
      git commit -m "First Commit";
    `)
      .then(() => server.start());
  });

  after(() =>
    execShell(`rm -rf ${config.repoPath}`)
      .then(() => server.stop())
  );
  describe('given that "branch" and "path" params are given', () => {
    let response;
    before(() =>
      rp(`http://${config.host}:${config.port}/blob?ref=refs/heads/test&path=file`)
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
            '<div class="blob">',
              '<pre class="blob__content">FooBar</pre>',
            '</div>',
          '</body>',
        '</html>'
      ].join('');
      /* eslint-enable indent */

      expect(response).to.equal(expected);
    });
  });
});
