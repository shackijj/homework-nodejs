const { expect } = require('chai');

function checkItemsInTreeList (items) {
  it(`will show only ${items} items`, function () {
    return this.browser
      .elements('.tree-list__item')
      .then(response => {
        expect(response.value).to.have.length(items);
      });
  });
}

function checkLinkToPreviousFolder () {
  it('should show a link to to a previous folder', function () {
    return this.browser
      .assertTextOfElementEqual('(//a[@class="link-back__link"])[1]', '..');
  });
}

function checkContentOfFile (filename, content) {
  it(`should show a content of the ${filename}`, function () {
    return this.browser
      .assertTextOfElementEqual('.blob__content', content);
  });
}

describe('User opens the tree of test1 branch.', function () {
  beforeEach(function () {
    return this.browser.openUrlAndClick('/', '(//a[@class="branch__tree"])[1]');
  });

  function checkItemsInRootDirOfTheBranch () {
    checkItemsInTreeList(2);

    it('should show file.js', function () {
      return this.browser
        .assertTextOfElementEqual('(//a[@class="blob-object__link"])[1]', 'file.js');
    });

    it('should show dir', function () {
      return this.browser
        .assertTextOfElementEqual('(//a[@class="tree-object__link"])[1]', 'dir1');
    });
  }

  checkItemsInRootDirOfTheBranch();

  describe('User click on file1.js', function () {
    beforeEach(function () {
      return this.browser.click('(//a[@class="blob-object__link"])[1]');
    });

    checkContentOfFile('file1.js', 'File1 Branch: test1');
  });

  describe('User clicks on dir1.', function () {
    beforeEach(function () {
      return this.browser.click('(//a[@class="tree-object__link"])[1]');
    });

    checkItemsInTreeList(2);

    it('should show file2.js', function () {
      return this.browser
        .assertTextOfElementEqual('(//a[@class="blob-object__link"])[1]', 'file1.js');
    });

    checkLinkToPreviousFolder();

    describe('User clicks on the link to previous folders.', function () {
      beforeEach(function () {
        return this.browser.click('(//a[@class="link-back__link"])[1]');
      });

      checkItemsInRootDirOfTheBranch();
    });
  });
});

describe('User opens the tree of test2 branch.', function () {
  beforeEach(function () {
    return this.browser.openUrlAndClick('/', '(//a[@class="branch__tree"])[2]');
  });

  function checkItemsInRootDirOfTheBranch () {
    checkItemsInTreeList(3);

    it('should show file.js', function () {
      return this.browser
        .assertTextOfElementEqual('(//a[@class="blob-object__link"])[1]', 'file.js');
    });

    it('should show dir1', function () {
      return this.browser
        .assertTextOfElementEqual('(//a[@class="tree-object__link"])[1]', 'dir1');
    });

    it('should show dir2', function () {
      return this.browser
        .assertTextOfElementEqual('(//a[@class="tree-object__link"])[2]', 'dir2');
    });
  }

  describe('User click on file1.js', function () {
    beforeEach(function () {
      return this.browser.click('(//a[@class="blob-object__link"])[1]');
    });

    checkContentOfFile('file1.js', 'File1 Branch: test2');
  });

  checkItemsInRootDirOfTheBranch();

  describe('User clicks on dir2.', function () {
    beforeEach(function () {
      return this.browser.click('(//a[@class="tree-object__link"])[2]');
    });

    checkItemsInTreeList(2);

    it('should show dir3', function () {
      return this.browser
        .assertTextOfElementEqual('(//a[@class="tree-object__link"])[1]', 'dir3');
    });

    checkLinkToPreviousFolder();

    describe('User clicks on dir3.', function () {
      beforeEach(function () {
        return this.browser.click('(//a[@class="tree-object__link"])[1]');
      });

      function checkContentOfDir3 () {
        checkItemsInTreeList(2);

        it('should show file3', function () {
          return this.browser
            .assertTextOfElementEqual('(//a[@class="blob-object__link"])[1]', 'file3.js');
        });
      }

      checkContentOfDir3();

      describe('User clicks on file3.js', function () {
        beforeEach(function () {
          return this.browser.click('(//a[@class="blob-object__link"])[1]');
        });

        it('will show content of file3.js', function () {
          return this.browser
            .assertTextOfElementEqual('.blob__content', 'File3.js');
        });

        describe('User click on the dir3 in the navigation', () => {
          beforeEach(function () {
            return this.browser.click('(//a[@class="navigation__link"])[3]');
          });

          checkContentOfDir3();
        });
      });
    });
  });
});
