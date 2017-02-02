import { BoardGqlAppPage } from './app.po';

describe('board-gql-app App', function() {
  let page: BoardGqlAppPage;

  beforeEach(() => {
    page = new BoardGqlAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
