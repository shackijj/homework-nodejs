function checkFileJsContent (content) {
  describe('User clicks on file.js', function () {
    beforeEach(function () {
      return this.browser.click('(//a[@class="blob-object__link"])[1]');
    });
    it('should show content of file.js', function () {
      return this.browser
        .assertTextOfElementEqual('(//pre[@class="blob__content"])[1]', content);
    });
  });
}

function checkFilesFromTheFirstCommit () {
  it('should show file.js', function () {
    return this.browser
      .assertTextOfElementEqual('(//a[@class="blob-object__link"])[1]', 'file.js');
  });

  it('should show dir1', function () {
    return this.browser
      .assertTextOfElementEqual('(//a[@class="tree-object__link"])[1]', 'dir1');
  });
}

describe('User opens the list of commits for branch test2.', function () {
  beforeEach(function () {
    return this.browser
      .openUrlAndClick('/', '(//a[@class="branch__log"])[2]');
  });

  describe('User clicks on tree of the first commit of test2 branch.', function () {
    beforeEach(function () {
      return this.browser.click('(//a[@class="commit__tree"])[2]');
    });

    checkFilesFromTheFirstCommit();
    checkFileJsContent('File1 Branch: test1');
  });

  describe('User clicks on tree of the second commit of test2 branch.', function () {
    beforeEach(function () {
      return this.browser.click('(//a[@class="commit__tree"])[1]');
    });

    checkFilesFromTheFirstCommit();

    it('should show dir2', function () {
      return this.browser
        .assertTextOfElementEqual('(//a[@class="tree-object__link"])[2]', 'dir2');
    });

    checkFileJsContent('File1 Branch: test2');
  });
});
