import { SampleAppPage } from './app.po';

describe('sample-app App', () => {
  let page: SampleAppPage;

  beforeEach(() => {
    page = new SampleAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
