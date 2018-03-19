const {createServer} = require('../src/index');
const {expect} = require('chai');

describe('App gets request on /', () => {
  const server = createServer();
  let result;
  before(() => {
    // init git repositry
    // touch file.js
    // echo "Funk" > file.js
    // git checkout -b "test1"
    // git add file.js
    // git commit -m "commit1"

    return server.start()
      .then(() => server.request('/'))
      .then((response) => {
        result = response;
      });
  });

  after(() => server.stop());

  it('will return the list of branches', () => {
    const expected = [
      '<!DOCTYPE html>',
      '<head>',
      '<title>Branches</title>',
      '</head>',
      '<body>',
      '<ul class="branch-list">',
      '<li class="branch-list__item">',
      '<div class="branch>test1</div>',
      '</li>',
      '</ul>',
      '</body>'
    ].join('');
    expect(response).to.eql(expected);
  });
});
