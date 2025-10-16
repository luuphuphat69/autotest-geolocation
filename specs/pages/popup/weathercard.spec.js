import { test, expect } from '@playwright/test';
import { SearchPage } from '../../../model/SearchPage';
import { ResultPage } from '../../../model/ResultPage';

test.describe("Convert temperature", () => {
    test("Convert temperature", async ({ page }) => {
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

        const unSelectedTemp = page.locator('span.weather-card__unit-option');

        const feelsLikeText = page.locator('#feels-like');
        const textBefore = feelsLikeText.textContent();

        await unSelectedTemp.click();
        if(textBefore.contains("C")){
            await expect(feelsLikeText).toContainText("F");
        }
        if(textBefore.contains("F")){
            await expect(feelsLikeText).toContainText("C");
        }
    })
})