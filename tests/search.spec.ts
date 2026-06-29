import { test, expect } from '@fixtures/test';
import { searchData } from '@data/books';

test.describe('Book Store search', () => {
  test.beforeEach(async ({ bookStorePage }) => {
    await bookStorePage.open();
  });

  test('finds a book by its exact title', async ({ bookStorePage }) => {
    await bookStorePage.search(searchData.existingTitle);

    await expect(bookStorePage.bookLinks).toHaveText([searchData.existingTitle]);
  });

  test('finds matching books by keyword', async ({ bookStorePage }) => {
    await bookStorePage.search(searchData.existingKeyword);

    await expect(bookStorePage.bookLinks).not.toHaveCount(0);
  });

  test('does not match books by ISBN', async ({ bookStorePage }) => {
    await bookStorePage.search(searchData.isbnQuery);

    await expect(bookStorePage.bookLinks).toHaveCount(0);
  });

  test('search is case insensitive', async ({ bookStorePage }) => {
    await bookStorePage.search(searchData.existingTitle.toUpperCase());

    await expect(bookStorePage.bookLinks).toHaveText([searchData.existingTitle]);
  });

  test('shows no results for an unknown term', async ({ bookStorePage }) => {
    await bookStorePage.search(searchData.nonExistingTerm);

    await expect(bookStorePage.bookLinks).toHaveCount(0);
  });

  test('shows no results for special characters', async ({ bookStorePage }) => {
    await bookStorePage.search(searchData.specialCharacters);

    await expect(bookStorePage.bookLinks).toHaveCount(0);
  });

  test('handles an excessively long query', async ({ bookStorePage }) => {
    await bookStorePage.search(searchData.longQuery);

    await expect(bookStorePage.bookLinks).toHaveCount(0);
  });

  test('restores the full list after clearing the search', async ({ bookStorePage }) => {
    const initialCount = await bookStorePage.visibleRowCount();

    await bookStorePage.search(searchData.nonExistingTerm);
    await expect(bookStorePage.bookLinks).toHaveCount(0);

    await bookStorePage.clearSearch();
    await expect(bookStorePage.bookLinks).toHaveCount(initialCount);
  });
});
