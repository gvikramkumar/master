import { AppPage } from './app.po';

describe('ui App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should show pages div', () => {
    page.navigateTo();
    expect(page.getPagesDiv()).toBeDefined();
  });
});
