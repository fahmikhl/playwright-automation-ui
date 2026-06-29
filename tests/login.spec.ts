import { test, expect } from '@fixtures/test';
import { buildCredentials, registerUser } from '@utils/accountApi';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('logs in with valid credentials', async ({ loginPage, page, request }) => {
    
    const account = buildCredentials();
    await registerUser(request, account);

    await loginPage.login(account.username, account.password);

    await expect(page).toHaveURL(/profile/);
  });

  test('rejects invalid credentials', async ({ loginPage }) => {
    await loginPage.login('unknown_user_zzz', 'Wrong@123');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(/invalid username or password/i);
  });

  test('does not navigate away when fields are empty', async ({ loginPage, page }) => {
    await loginPage.submitEmpty();

    await expect(page).toHaveURL(/login/);
  });
});
