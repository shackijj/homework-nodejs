const getLogRequest = require('../../../controllers/log/getLogRequest');
const sinon = require('sinon');
const { expect } = require('chai');

describe('getLogRequest', () => {
  let result;
  let request = { query: {} };
  let logForRefStub;
  let logForRefStubArgs;
  const count = 5;
  const ref = 'some/revision';
  const repoPath = '/some/path';

  beforeEach(() =>
    getLogRequest(repoPath, request, count, logForRefStub)
      .then((output) => {
        result = output;
        logForRefStubArgs = logForRefStub.getCall(0).args;
      })
  );

  describe('given that the request does not contain skip and total > count', () => {
    before(() => {
      request.query = { ref };
      logForRefStub = sinon.spy(() => Promise.resolve({
        total: 10,
        commits: []
      }));
    });
    it('will call logForRef with default skip\'s value 0', () => {
      expect(logForRefStubArgs).to.eql([repoPath, ref, count, 0]);
    });
    it('will return a pagination with "older" link', () => {
      expect(result).to.eql({
        pagination: {
          newer: '',
          older: '/log?ref=some/revision&skip=5'
        },
        commits: [],
        title: ref,
      });
    });
  });
  describe('given that the request does contains skip and total < skip + count', () => {
    before(() => {
      request.query = { ref, skip: '5' };
      logForRefStub = sinon.spy(() => Promise.resolve({
        total: 8,
        commits: []
      }));
    });
    it('will call logForRef with skip\'s value', () => {
      expect(logForRefStubArgs).to.eql([repoPath, ref, count, 5]);
    });
    it('will return a pagination with newer value only', () => {
      expect(result).to.eql({
        pagination: {
          newer: '/log?ref=some/revision&skip=0',
          older: ''
        },
        commits: [],
        title: ref
      });
    });
  });

  describe('given that the request does contains skip and total < skip + count', () => {
    before(() => {
      request.query = { ref, skip: '5' };
      logForRefStub = sinon.spy(() => Promise.resolve({
        total: 30,
        commits: []
      }));
    });
    it('will call logForRef with skip\'s value', () => {
      expect(logForRefStubArgs).to.eql([repoPath, ref, count, 5]);
    });
    it('will return a pagination with newer and older value', () => {
      expect(result).to.eql({
        pagination: {
          newer: '/log?ref=some/revision&skip=0',
          older: '/log?ref=some/revision&skip=10'
        },
        title: ref,
        commits: []
      });
    });
  });
});
