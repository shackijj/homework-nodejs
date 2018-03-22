const treeNavigation = require('../../controllers/treeNavigation');
const { expect } = require('chai');

describe('#treeNavigation', () => {
  let result;
  let path;
  let commit = 'someCommit';
  beforeEach(() => {
    result = treeNavigation(path, commit);
  });

  describe('given that path is an empty string', () => {
    before(() => {
      path = '';
    });
    it('will return an empty array', () => {
      expect(result).to.eql([]);
    });
  });

  describe('given that path contains one item', () => {
    before(() => {
      path = 'dir';
    });
    it('will return link to the root and the item', () => {
      expect(result).to.eql([
        {
          name: 'root',
          href: '/tree?commit=someCommit'
        },
        {
          name: 'dir',
          href: ''
        }
      ]);
    });
  });

  describe('given that path contains a long path', () => {
    before(() => {
      path = 'dir1/dir2/dir3';
    });
    it('will return link to the root and to the each item in the path', () => {
      expect(result).to.eql([
        {
          name: 'root',
          href: '/tree?commit=someCommit'
        },
        {
          name: 'dir1',
          href: '/tree?commit=someCommit&path=dir1'
        },
        {
          name: 'dir2',
          href: '/tree?commit=someCommit&path=dir1/dir2'
        },
        {
          name: 'dir3',
          href: ''
        }
      ]);
    });
  });
});
