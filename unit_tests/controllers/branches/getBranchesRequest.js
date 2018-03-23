const getBranchesRequest = require('../../../controllers/branches/getBranchesRequest');
const { expect } = require('chai');
describe('getBranchesRequest', () => {
  let forEachRefStub;
  let result;

  beforeEach(() =>
    getBranchesRequest('repo/path', 'refs/heads/', forEachRefStub)
      .then((output) => {
        result = output;
      })
  );
  describe('given that the forEachRef returned Promise', () => {

    forEachRefStub = () => Promise.resolve([ 'branch1', 'branch2' ]);

    it('should return a list of branches', () => {
      expect(result).to.eql([
        {
          name: 'branch1',
          treeHref: '/tree?commit=branch1',
          logHref: '/log?ref=branch1'
        },
        {
          name: 'branch2',
          treeHref: '/tree?commit=branch2',
          logHref: '/log?ref=branch2'
        }
      ]);
    });
  });
});
