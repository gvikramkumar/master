const DeptUploadController = require('./controller'),
  repo = require('../../../../../spec/helpers/mock-repo')(),
  _ = require('lodash'),
  Range = require('./range.js')



fdescribe('upload/dept-upload tests', () => {
  let sut;

  beforeAll(() => {
    sut = new DeptUploadController();
    sut.repo = repo;
  });

  describe('getRangesFromGlAcounts tests', () => {
    /*
    * should handle single acct 60000
    * should handle single acct 69999
    * should handle single acct other
    * should handle 2 accts 60000
    * should handle 2 accts 69999
    * should handle 2 accts other
    * should handle multiple accts 60000
    * should handle multiple accts 69999
    * should handle multiple accts other
     */

    it('should handle 0 accounts', () => {
      const ranges = sut.getRangesFromGlAccounts([]);
      expect(ranges.length).toBe(1);
      expect(ranges[0]).toEqual({start: 60000, end: 69999});
    })

    it('should handle 1 account 60000', () => {
      const ranges = sut.getRangesFromGlAccounts([60000]);
      expect(ranges.length).toBe(1);
      expect(ranges[0]).toEqual({start: 60001, end: 69999});
    })

    it('should handle 1 account 69999', () => {
      const ranges = sut.getRangesFromGlAccounts([69999]);
      expect(ranges.length).toBe(1);
      expect(ranges[0]).toEqual({start: 60000, end: 69998});
    })

    it('should handle 1 account other', () => {
      const ranges = sut.getRangesFromGlAccounts([60010]);
      expect(ranges.length).toBe(2);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 69999});
    })

    it('should handle 2 accounts 60000', () => {
      const ranges = sut.getRangesFromGlAccounts([60000, 60010]);
      expect(ranges.length).toBe(2);
      expect(ranges[0]).toEqual({start: 60001, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 69999});
    })

    it('should handle 2 accounts 69999', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 69999]);
      expect(ranges.length).toBe(2);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 69998});
    })

    it('should handle 2 accounts other', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 60020]);
      expect(ranges.length).toBe(3);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 60019});
      expect(ranges[2]).toEqual({start: 60021, end: 69999});
    })

    it('should handle 3 accounts 60000', () => {
      const ranges = sut.getRangesFromGlAccounts([60000, 60010, 60020]);
      expect(ranges.length).toBe(3);
      expect(ranges[0]).toEqual({start: 60001, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 60019});
      expect(ranges[2]).toEqual({start: 60021, end: 69999});
    })

    it('should handle 3 accounts 69999', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 60020, 69999]);
      expect(ranges.length).toBe(3);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 60019});
      expect(ranges[2]).toEqual({start: 60021, end: 69998});
    })

    it('should handle 3 accounts other', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 60020, 60030]);
      expect(ranges.length).toBe(4);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 60019});
      expect(ranges[2]).toEqual({start: 60021, end: 60029});
      expect(ranges[3]).toEqual({start: 60031, end: 69999});
    })

    it('should handle 4 accounts', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 60020, 69950, 69960]);
      expect(ranges.length).toBe(5);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 60019});
      expect(ranges[2]).toEqual({start: 60021, end: 69949});
      expect(ranges[3]).toEqual({start: 69951, end: 69959});
      expect(ranges[4]).toEqual({start: 69961, end: 69999});
    })

    it('should handle 2 accounts succession 60000,60001', () => {
      const ranges = sut.getRangesFromGlAccounts([60000, 60001]);
      expect(ranges.length).toBe(1);
      expect(ranges[0]).toEqual({start: 60002, end: 69999});
    })

    it('should handle 2 accounts succession 69998,69999', () => {
      const ranges = sut.getRangesFromGlAccounts([69998, 69999]);
      expect(ranges.length).toBe(1);
      expect(ranges[1]).toEqual({start: 60000, end: 69997});
    })

    it('should handle 2 accounts succession other', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 60011]);
      expect(ranges.length).toBe(2);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60012, end: 69999});
    })

    it('should handle 3 accounts succession 60000,60001,60002', () => {
      const ranges = sut.getRangesFromGlAccounts([60000, 60001, 60002]);
      expect(ranges.length).toBe(1);
      expect(ranges[0]).toEqual({start: 60003, end: 69999});
    })

    it('should handle 3 accounts succession 69997,69998,69999', () => {
      const ranges = sut.getRangesFromGlAccounts([69997, 69998, 69999]);
      expect(ranges.length).toBe(1);
      expect(ranges[1]).toEqual({start: 60000, end: 69996});
    })

    it('should handle 3 accounts succession other', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 60011, 600012]);
      expect(ranges.length).toBe(2);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60013, end: 69999});
    })

    it('should handle single number ranges 60000', () => {
      const ranges = sut.getRangesFromGlAccounts([60000, 60002]);
      expect(ranges.length).toBe(2);
      expect(ranges[0]).toEqual({start: 60001, end: 60001});
      expect(ranges[1]).toEqual({start: 60003, end: 69999});
    })

    it('should handle single number ranges 69999', () => {
      const ranges = sut.getRangesFromGlAccounts([69997, 69999]);
      expect(ranges.length).toBe(2);
      expect(ranges[0]).toEqual({start: 60000, end: 69996});
      expect(ranges[1]).toEqual({start: 69998, end: 69998});
    })

    it('should handle single number ranges other', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 60012]);
      expect(ranges.length).toBe(3);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 60011});
      expect(ranges[1]).toEqual({start: 60013, end: 69999});
    })

    it('should handle successive single number ranges', () => {
      const ranges = sut.getRangesFromGlAccounts([60010, 60012, 60014]);
      expect(ranges.length).toBe(4);
      expect(ranges[0]).toEqual({start: 60000, end: 60009});
      expect(ranges[1]).toEqual({start: 60011, end: 60011});
      expect(ranges[1]).toEqual({start: 60013, end: 60013});
      expect(ranges[1]).toEqual({start: 60015, end: 69999});
    })




  })


})
