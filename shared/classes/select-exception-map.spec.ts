import {SelectExceptionMap} from './select-exception-map';


fdescribe('SelectExceptionMap tests', () => {
  let em;
  beforeAll(() => {
    em = new SelectExceptionMap();
  });

  it('getSelectArray', () => {
    const results = [];
    results.push(em.getSelectArray('not in', ['one', 'two']));
    expect(results).toEqual([
      ['NOT IN', 'ONE', 'TWO']
    ]);
  });

});







