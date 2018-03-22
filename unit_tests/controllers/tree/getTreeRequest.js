const getTreeViewModel = require('../../../controllers/tree/getTreeViewModel');
const { expect } = require('chai');

describe('#getTreeViewModel', () => {
  let result;
  let path;
  let treeishId = 'sommeId';
  let commit = 'someCommit';
  let lsTreeStub;
  const repoPath = 'path/to/repo';

  beforeEach(() => getTreeViewModel(repoPath, treeishId, commit, path, lsTreeStub)
    .then(output => {
      result = output;
    }));

  describe('given that requested object is a tree and "path" param is not given', () => {
    before(() => {
      lsTreeStub = () => Promise.resolve([
        {
          type: 'tree',
          hash: '1',
          path: 'dir'
        },
        {
          type: 'blob',
          hash: '2',
          path: 'file'
        }
      ]);
    });
    it('will return a list of files and directories', () => {
      expect(result).to.eql([
        {
          type: 'tree',
          name: 'dir',
          href: `/tree?hash=1&path=dir&commit=someCommit`
        },
        {
          type: 'blob',
          name: 'file',
          href: `/blob?hash=2&path=file&commit=someCommit`
        }
      ]);
    });
  });

  describe('given that requested object is a tree and the path param is "dir"', () => {
    before(() => {
      lsTreeStub = () => Promise.resolve([
        {
          type: 'tree',
          hash: '1',
          path: 'dir'
        },
        {
          type: 'blob',
          hash: '2',
          path: 'file'
        }
      ]);
      path = 'some/path';
    });

    it('will return a list of files and directories inside dir folder and link to come upper in the tree', () => {
      expect(result).to.eql([
        {
          type: 'link-back',
          href: '/tree?commit=someCommit&path=some'
        },
        {
          type: 'tree',
          name: 'dir',
          href: '/tree?hash=1&path=some/path/dir&commit=someCommit'
        },
        {
          type: 'blob',
          name: 'file',
          href: '/blob?hash=2&path=some/path/file&commit=someCommit'
        }
      ]);
    });
  });
});
