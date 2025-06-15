import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/mainPage';
import { GamePage } from '../pages/gamePage';

test.describe('Avito Games Tests', () => {
    const BASE_URL = 'https://makarovartem.github.io/frontend-avito-tech-test-assignment';

    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test('Open game card', async ({ page }) => {
        const mainPage = new MainPage(page);
        const gamePage = new GamePage(page);

        await mainPage.openFirstCard();
        await gamePage.verifyGamePageOpened();
    });

    test('Verify game per page', async ({ page }) => {
        const mainPage = new MainPage(page);
        const initialCount = await mainPage.getGameCardsCount();

        expect(initialCount).toBeGreaterThan(0);
        await mainPage.verifyGamesPerPage(initialCount);
    });

    test('Pagination navigation', async ({ page }) => {
        const mainPage = new MainPage(page);
        const initialPage = await mainPage.getActivePageNumber();

        // навигация на следующую страницу
        await mainPage.navigateToNextPage();
        expect(await mainPage.getActivePageNumber()).toBe(initialPage + 1);

        // навигация на предыдущую страницу
        await mainPage.navigateToPrevPage();
        expect(await mainPage.getActivePageNumber()).toBe(initialPage);
    });
});