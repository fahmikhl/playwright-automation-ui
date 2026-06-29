import { test, expect } from '@fixtures/test';
import { knownBooks } from '@data/books';

const book = knownBooks[0];

test.describe('Book detail', () => {
  test('opens a book and shows details consistent with the list', async ({
    bookStorePage,
    bookDetailPage,
  }) => {
    await bookStorePage.open();
    const author = await bookStorePage.authorOf(book.title);
    const publisher = await bookStorePage.publisherOf(book.title);

    await bookStorePage.openBookByTitle(book.title);

    expect(await bookDetailPage.isbnFromUrl()).toBe(book.isbn);
    await expect(bookDetailPage.textOnPage(book.title).first()).toBeVisible();
    await expect(bookDetailPage.textOnPage(author).first()).toBeVisible();
    await expect(bookDetailPage.textOnPage(publisher).first()).toBeVisible();
  });

  test('returns to the book store from the detail page', async ({
    bookStorePage,
    bookDetailPage,
    page,
  }) => {
    await bookStorePage.open();
    await bookStorePage.openBookByTitle(book.title);

    await bookDetailPage.backToStore();

    await expect(page).toHaveURL(/\/books$/);
  });
});
