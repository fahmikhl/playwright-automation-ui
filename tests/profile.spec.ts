import { test, expect } from '@fixtures/test';
import { addBookToCollection, deleteAllBooks } from '@utils/bookStoreApi';
import { knownBooks } from '@data/books';

// Authentication is supplied by the `chromium-auth` project's storageState.
test.describe.configure({ mode: 'serial' });

const book = knownBooks[0];

test.describe('Profile collection', () => {
  test.afterEach(async ({ request, authSession }) => {
    await deleteAllBooks(request, authSession);
  });

  test('shows the logged in user', async ({ profilePage, authSession }) => {
    await profilePage.open();

    expect(await profilePage.loggedInUser()).toBe(authSession.username);
  });

  test('starts with an empty collection', async ({ profilePage }) => {
    await profilePage.open();

    await expect(profilePage.bookRows).toHaveCount(0);
  });

  test('renders a book added to the collection', async ({ request, profilePage, authSession }) => {
    await addBookToCollection(request, authSession, book.isbn);

    await profilePage.open();

    await expect(profilePage.bookLinks).toContainText([book.title]);
  });

  test('reflects an emptied collection', async ({ request, profilePage, authSession }) => {
    await addBookToCollection(request, authSession, book.isbn);
    await deleteAllBooks(request, authSession);

    await profilePage.open();

    await expect(profilePage.bookRows).toHaveCount(0);
  });

  test('logs the user out', async ({ profilePage, page }) => {
    await profilePage.open();

    await profilePage.logout();

    await expect(page).toHaveURL(/login/);
  });
});
