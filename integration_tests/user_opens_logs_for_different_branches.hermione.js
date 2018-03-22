function checkTheListOfCommits (commitSubject, idx) {
  it(`should show commit with subject: ${commitSubject}`, function () {
    return this.browser
      .assertTextOfElementEqual(`(//span[@class="commit__subject"])[${idx + 1}]`, commitSubject);
  });
}

describe('User opens the list of commits for branch test1.', function () {
  beforeEach(function () {
    return this.browser.openUrlAndClick('/', '(//a[@class="branch__log"])[1]');
  });

  describe('User clicks the log of test1 branch.', function () {
    [ 'First commit' ].forEach(checkTheListOfCommits);
  });
});

describe('User opens the list of commits for branch test2.', function () {
  beforeEach(function () {
    return this.browser.openUrlAndClick('/', '(//a[@class="branch__log"])[2]');
  });

  describe('User clicks the log of test1 branch.', function () {
    [ 'Second commit', 'First commit' ].forEach(checkTheListOfCommits);
  });
});
