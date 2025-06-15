import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class MainPage extends BasePage {
    readonly gameCards: Locator;
    readonly paginationNext: Locator;
    readonly paginationPrev: Locator;
    readonly activePage: Locator;

    constructor(page: Page) {
        super(page);
        this.gameCards = page.locator('.game-card');
        this.paginationNext = page.locator('.pagination-next');
        this.paginationPrev = page.locator('.pagination-prev');
        this.activePage = page.locator('.pagination-active')
    }

    async getGameCardsCount(): Promise<number> {
        return this.gameCards.count();
    }

    async openFirstCard() {
        return this.gameCards.first().click();
    }

    async navigateToNextPage() {
        await this.paginationNext.click();
    }

    async navigateToPrevPage() {
        await this.paginationPrev.click();
    }

    async getActivePageNumber(): Promise<number> {
        return Number(await this.activePage.textContent());
    }

    async verifyGamesPerPage(expectedCount: number) {
        const actualCount = await this.getGameCardsCount();
        expect(actualCount).toBe(expectedCount);
    }
}
