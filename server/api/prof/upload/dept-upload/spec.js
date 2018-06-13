const DeptUploadController = require('./controller'),
  repo = require('../../../../../spec/helpers/mock-repo')();


fdescribe('upload/dept-upload tests', () => {
  let sut;

  beforeAll(() => {
    sut = new DeptUploadController();
    sut.repo = repo;
  });



})
