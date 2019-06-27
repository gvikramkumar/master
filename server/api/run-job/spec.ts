import RunJobController from './controller';


fdescribe('runJobController tests', () => {
  let sut;
  beforeEach(() => {
    sut = new RunJobController(<any>{}, <any>{}, <any>{}, <any>{}, <any>{});
  });

  it('should work', () => {
    expect(sut.test()).toBe('lala');
  });

});



