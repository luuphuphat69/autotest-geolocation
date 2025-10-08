// @ts-check
import { test, expect } from '@playwright/test';
import { SearchPage } from '../../../../model/SearchPage';
import { ResultPage } from '../../../../model/ResultPage';
import { testCities } from '../../../../testdata/search-data';

test.describe('Details - temperature unit toggle', () => {
    test('Current weather section', async ({ page }) => {
        const searchPage = new SearchPage(page);
        const resultPage = new ResultPage(page);
        const city = testCities[0];

        // 1) Go to search page
        await searchPage.goToSearchPage();
        await expect(searchPage.searchInput).toBeVisible();

        // 2) Enter a city then submit search
        await searchPage.fillInSearchBar(city);
        await searchPage.submitSearch();

        // 3) Wait for result page and click the city row -> open weather dialog
        await expect(page).toHaveURL(`${resultPage.RESULT_BASE_URL}?city=${city}`);
        const rows = page.locator('.city-table tbody tr');
        await expect(rows.first()).toBeVisible();
        // Find row that contains the city name to be robust
        const cityRow = rows.filter({ hasText: city }).first();
        await cityRow.click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();

        // 4) Click Eyes button to navigate to Details page
        // In dialog, the eye button should be present; try role or icon-based locator fallbacks
        const eyesButton = dialog.locator('[aria-label="See more details"]').first();
        await eyesButton.click();

        // 5) On Details page, in "Current Weather" card, toggle temperature units
        await expect(page).toHaveURL(/\/details\?/);
        const currentWeatherCard = page.locator(".weather-card").first();
        await expect(currentWeatherCard).toBeVisible();

        // Capture temperature text before toggle
        const temperatureValue = currentWeatherCard.locator('.text-6xl.font-bold.text-blue-700');
        await expect(temperatureValue).toBeVisible();
        const beforeText = (await temperatureValue.textContent()) ?? '';

        // Buttons for unit toggle (C and F)
        const cButton = currentWeatherCard.getByRole('button', { name: /\bC\b/ });
        const fButton = currentWeatherCard.getByRole('button', { name: /\bF\b/ });
        await expect(cButton).toBeVisible();
        await expect(fButton).toBeVisible();

        // Click F and expect unit to be F and value to change format
        await fButton.click();
        await expect(temperatureValue).toContainText(/°F/);

        // Click C and expect unit to be C
        await cButton.click();
        await expect(temperatureValue).toContainText(/°C/);

        // Basic sanity: value should be numeric and followed by unit
        const textAfter = (await temperatureValue.textContent()) ?? '';
        expect(textAfter).toMatch(/^\s*-?\d+(?:\.\d+)?\s*°[CF]\s*$/);
    });

    test("5 days forecast section", async ({ page }) => {
        const searchPage = new SearchPage(page);
        const resultPage = new ResultPage(page);
        const city = testCities[0];

        // 1) Go to search page
        await searchPage.goToSearchPage();
        await expect(searchPage.searchInput).toBeVisible();

        // 2) Enter a city then submit search
        await searchPage.fillInSearchBar(city);
        await searchPage.submitSearch();

        // 3) Wait for result page and click the city row -> open weather dialog
        await expect(page).toHaveURL(`${resultPage.RESULT_BASE_URL}?city=${city}`);
        const rows = page.locator('.city-table tbody tr');
        await expect(rows.first()).toBeVisible();
        // Find row that contains the city name to be robust
        const cityRow = rows.filter({ hasText: city }).first();
        await cityRow.click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();

        // 4) Click Eyes button to navigate to Details page
        // In dialog, the eye button should be present; try role or icon-based locator fallbacks
        const eyesButton = dialog.locator('[aria-label="See more details"]').first();
        await eyesButton.click();

        // 5) On Details page, in "Current Weather" card, toggle temperature units
        await expect(page).toHaveURL(/\/details\?/);
        const weatherForecastCard = page.locator(".forecast-weather-card");
        await expect(weatherForecastCard).toBeVisible();

        for(let i = 0; i < 5; i++){
            const weatherForecastBlock = weatherForecastCard.locator(".forecast-day").nth(i);
            const weatherTemp = weatherForecastBlock.locator(".text-right");
            const celciuseBtn = weatherForecastCard.locator("#celsius");
            const fahrenheitBtn = weatherForecastCard.locator("#fahrenheit");

            await expect(weatherForecastBlock).toBeVisible();
            await expect(weatherTemp).toBeVisible();
            
            await fahrenheitBtn.click();
            await expect(weatherTemp).toContainText(/°F/)

            await celciuseBtn.click();
            await expect(weatherTemp).toContainText(/°C/)
        }

    })
});