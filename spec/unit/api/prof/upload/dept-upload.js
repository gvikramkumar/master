const DeptUploadController = require('../../../../../server/api/prof/upload/dept-upload/controller');

fdescribe('upload/dept-upload tests', () => {
  let sut;

  beforeAll(() => {
    sut = new DeptUploadController();


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

    it('should handle single acct 60000', () => {
      expect(sut.getRangesFromGlAcounts([60000])).toEqual([{acct: 60000, start: 60001, end: 69999}])
    })

  })


})
