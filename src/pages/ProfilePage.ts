import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly usernameValue: Locator;
  readonly searchBox: Locator;
  readonly bookLinks: Locator;
  readonly bookRows: Locator;
  readonly logoutButton: Locator;
  readonly deleteAllBooksButton: Locator;
  readonly deleteAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameValue = page.locator('#userName-value');
    this.searchBox = page.locator('#searchBox');
    this.bookLinks = page.locator('table tbody a');
    this.bookRows = page.locator('table tbody tr');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.deleteAllBooksButton = page.getByRole('button', { name: 'Delete All Books' });
    this.deleteAccountButton = page.getByRole('button', { name: 'Delete Account' });
  }

  async open(): Promise<void> {
    await this.goto('/profile');
  }

  async loggedInUser(): Promise<string> {
    return (await this.usernameValue.innerText()).trim();
  }

  async collectionTitles(): Promise<string[]> {
    return this.bookLinks.allInnerTexts();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
