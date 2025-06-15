import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class GamePage extends BasePage {
    readonly gameTitle: Locator;
    readonly gameDescription: Locator;

    constructor(page: Page) {
        super(page);
        this.gameTitle = page.locator('.game-title');
        this.gameDescription = page.locator('.game-descr');
    }

    async verifyGamePageOpened() {
        await expect(this.gameTitle).toBeVisible();
        await expect(this.gameDescription).toBeVisible();
    }
}