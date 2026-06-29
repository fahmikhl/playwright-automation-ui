import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BookDetailPage extends BasePage {
  readonly isbnValue: Locator;
  readonly backToStoreButton: Locator;

  constructor(page: Page) {
    super(page);
    this.isbnValue = page.locator('#ISBN-wrapper #userName-value, #ISBN-wrapper').first();
    this.backToStoreButton = page.getByRole('button', { name: 'Back To Book Store' });
  }

  fieldValue(label: string): Locator {
    return this.page.locator('#bookForm .row', { hasText: label }).locator('label').nth(1);
  }

  textOnPage(value: string): Locator {
    return this.page.getByText(value, { exact: false });
  }

  async isbnFromUrl(): Promise<string> {
    const url = new URL(await this.currentUrl());
    return url.searchParams.get('search') ?? '';
  }

  async backToStore(): Promise<void> {
    await this.backToStoreButton.click();
  }
}
