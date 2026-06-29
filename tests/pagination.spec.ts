import { test, expect } from '@fixtures/test';

test.describe('Book Store pagination', () => {
  test.beforeEach(async ({ bookStorePage }) => {
    await bookStorePage.open();
  });

  test('renders the full catalogue on a single page', async ({ bookStorePage }) => {
    expect(await bookStorePage.visibleRowCount()).toBeGreaterThan(0);
    await expect(bookStorePage.pageInfo).toHaveText(/Page 1 of 1/);
  });

  test('disables previous and next navigation on a single page', async ({ bookStorePage }) => {
    await expect(bookStorePage.previousButton).toBeDisabled();
    await expect(bookStorePage.nextButton).toBeDisabled();
  });
});
