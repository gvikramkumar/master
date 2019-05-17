import {SourcePO} from './source.po';

describe(`SourcePO`, () => {
  const page = new SourcePO();
  const source = {
    name: `Active Test Source`,
    typeCode: 'ATEST',
    description: `Adding a new active test source`,
    status: 'Active'
  };
  beforeEach(() => {
    SourcePO.navigateTo();
  });

  it(`should add a new source with active status`, () => {
    SourcePO.getAddButton().click();
    SourcePO.getFieldName().sendKeys(source.name);
    SourcePO.getFieldTypeCode().sendKeys(source.typeCode);
    SourcePO.getFieldDescription().sendKeys(source.description);
    SourcePO.getStatusCheckBox().click();
    SourcePO.getSubmitButton().click();
    SourcePO.getPaginatorNextButton().click();
    SourcePO.getPaginatorNextButton().click();
    expect(SourcePO.getFirstCellInARow().getText()).toEqual(source.name);
    expect(SourcePO.getCellRow().get(1).getText()).toEqual(source.typeCode);
    expect(SourcePO.getCellRow().last().getText()).toEqual(source.status);

  });

  it(`should update an existing source`, () => {
    SourcePO.getPaginatorNextButton().click();
    SourcePO.getPaginatorNextButton().click();
    SourcePO.getFirstCellInARow().click();
    SourcePO.getFieldName().clear();
    SourcePO.getFieldName().sendKeys('Inactive Test Source');
    SourcePO.getFieldTypeCode().clear();
    SourcePO.getFieldTypeCode().sendKeys('ITEST');
    SourcePO.getFieldDescription().clear();
    SourcePO.getFieldDescription().sendKeys('Updated source to inactive');
    SourcePO.getStatusCheckBox().click();
    SourcePO.getSubmitButton().click();
    expect(SourcePO.getFirstCellInARow().getText()).toEqual(`Inactive Test Source`);
    expect(SourcePO.getCellRow().get(1).getText()).toEqual('ITEST');
    expect(SourcePO.getCellRow().last().getText()).toEqual(`Inactive`);
  });

  it(`should find source from search field`, () => {
    SourcePO.getSearchField().sendKeys(`Inactive Test Source`);
    expect(SourcePO.getFirstCellInARow().getText()).toEqual(`Inactive Test Source`);
    expect(SourcePO.getCellRow().get(1).getText()).toEqual('ITEST');
    expect(SourcePO.getCellRow().last().getText()).toEqual(`Inactive`);
  });
});
