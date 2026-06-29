import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BookStorePage extends BasePage {
  readonly searchBox: Locator;
  readonly bookLinks: Locator;
  readonly rows: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly pageInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.locator('#searchBox');
    this.bookLinks = page.locator('table tbody a');
    this.rows = page.locator('table tbody tr').filter({ has: page.locator('a') });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.pageInfo = page.getByText(/Page \d+ of \d+/);
  }

  async open(): Promise<void> {
    await this.goto('/books');
    await this.bookLinks.first().waitFor({ state: 'visible' });
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
  }

  async clearSearch(): Promise<void> {
    await this.searchBox.clear();
  }

  async visibleTitles(): Promise<string[]> {
    return this.bookLinks.allInnerTexts();
  }

  async visibleRowCount(): Promise<number> {
    return this.bookLinks.count();
  }

  rowByTitle(title: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('link', { name: title, exact: true }) });
  }

  async authorOf(title: string): Promise<string> {
    return (await this.rowByTitle(title).locator('td').nth(2).innerText()).trim();
  }

  async publisherOf(title: string): Promise<string> {
    return (await this.rowByTitle(title).locator('td').nth(3).innerText()).trim();
  }

  async openBookByTitle(title: string): Promise<void> {
    await this.page.getByRole('link', { name: title, exact: true }).click();
  }
}
