import { test as base } from '@playwright/test';
import { BookStorePage } from '@pages/BookStorePage';
import { BookDetailPage } from '@pages/BookDetailPage';
import { LoginPage } from '@pages/LoginPage';
import { ProfilePage } from '@pages/ProfilePage';
import { AuthSession } from '@utils/accountApi';
import { readSession } from '@utils/authFiles';

interface Fixtures {
  bookStorePage: BookStorePage;
  bookDetailPage: BookDetailPage;
  loginPage: LoginPage;
  profilePage: ProfilePage;
  authSession: AuthSession;
}

export const test = base.extend<Fixtures>({
  bookStorePage: async ({ page }, use) => {
    await use(new BookStorePage(page));
  },
  bookDetailPage: async ({ page }, use) => {
    await use(new BookDetailPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  authSession: async ({}, use) => {
    await use(readSession());
  },
});

export { expect } from '@playwright/test';
