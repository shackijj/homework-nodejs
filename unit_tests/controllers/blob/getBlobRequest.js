const getBlobRequest = require('../../../controllers/blob/getBlobRequest');
const { expect } = require('chai');

describe('#getBlobRequest', () => {
  let repo = 'path/to/repo';
  let request;
  let result;
  const showStub = () => Promise.resolve('file-content');

  beforeEach(() =>
    getBlobRequest(repo, request, showStub)
      .then(output => {
        result = output;
      })
  );

  function checkBlobContentAndFileName () {
    it('will return content of file and navigation items', () => {
      expect(result.blob).to.equal('file-content');
    });
    it('will return commit\'s name', () => {
      expect(result.commit).to.equal('refs/heads/test');
    });
    it('will return title for a page', () => {
      expect(result.title).to.equal('refs/heads/test');
    });
  }

  describe('given that the file is in subdirectory', () => {
    before(() => {
      request = {
        query: {
          commit: 'refs/heads/test',
          path: 'dir/file-in-dir'
        }
      };
    });

    it('will return empty navigation', () => {
      expect(result.navigation).to.eql([
        {
          name: 'root',
          href: '/tree?commit=refs/heads/test'
        },
        {
          name: 'dir',
          href: '/tree?commit=refs/heads/test&path=dir'
        },
        {
          name: 'file-in-dir',
          href: ''
        }
      ]);
    });
    checkBlobContentAndFileName();
  });

  describe('given that the blob is in the root directory', () => {
    before(() => {
      request = {
        query: {
          commit: 'refs/heads/test',
          path: 'file'
        }
      };
    });
    it('will return navigation to the file', () => {
      expect(result.navigation).to.eql([
        {
          name: 'root',
          href: '/tree?commit=refs/heads/test'
        },
        {
          name: 'file',
          href: ''
        }
      ]);
    });
    checkBlobContentAndFileName();
  });
});
