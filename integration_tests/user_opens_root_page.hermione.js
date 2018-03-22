const { expect } = require('chai');

describe('User opens / page of app', function () {
  it('should have a title "Branches"', function () {
    return this.browser
      .url('/')
      .getTitle()
      .then(function (title) {
        expect(title).to.equal('Git - branches');
      });
  });

  it('should show existing branches in the repo', function () {
    return this.browser
      .url('/')
      .getText('.branch__name')
      .then(branchNames => {
        expect(branchNames).to.eql(['test1', 'test2']);
      });
  });

  describe('user clicks on links', function () {
    it('should have working links to /log page', function () {
      return this.browser
        .openUrlAndClick('/', '(//a[@class="branch__log"])[1]')
        .getTitle()
        .then((title) => {
          expect(title).to.equal('Git - refs/heads/test1');
        });
    });

    it('should have working links to /tree page', function () {
      return this.browser
        .openUrlAndClick('/', '(//a[@class="branch__tree"])[1]')
        .getTitle()
        .then((title) => {
          expect(title).to.equal('Git - refs/heads/test1');
        });
    });
  });
});
