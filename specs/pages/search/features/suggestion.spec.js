// @ts-check
import { test, expect } from '@playwright/test';
import { SearchPage } from '../../../../model/SearchPage';
import { testCities } from '../../../../testdata/search-data';

test.describe("Search with suggestion", () => {
  test('search with suggestion - different cities', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goToSearchPage();

    await expect(searchPage.searchInput).toBeVisible();

    for (const city of testCities) {
      await searchPage.clearSearchBar();
      await searchPage.fillInSearchBar(city);

      await searchPage.waitForAutocompleteVisible({ timeout: 10000 });

      const suggestions = searchPage.autoCompleteList.locator("li");
      await expect(suggestions.first()).toBeVisible();

      const suggestionText = await suggestions.first().textContent();
      expect(suggestionText?.toLowerCase()).toContain(city.toLowerCase());
    }
  });

  test('search with suggestion - autocomplete disappears when cleared', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const city = testCities[1];

    await searchPage.goToSearchPage();
    await expect(searchPage.searchInput).toBeVisible();

    await searchPage.fillInSearchBar(city);
    await searchPage.waitForAutocompleteVisible({ timeout: 10000 });

    await searchPage.clearSearchBar();
    await expect(searchPage.autoCompleteList).not.toBeVisible();
  });

  test('search with suggestion - click on suggestion', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const city = testCities[0];

    await searchPage.goToSearchPage();
    await expect(searchPage.searchInput).toBeVisible();

    await searchPage.fillInSearchBar(city);
    await searchPage.waitForAutocompleteVisible({ timeout: 10000 });

    await searchPage.clickFirstSuggestion();
    await searchPage.expectUrlEquals(expect, `https://www.geolocation.space/result?city=${city}`);
  });
});

test.describe("Search without suggestion", () => {
  test("Search with button", async ({ page }) => {
    const searchPage = new SearchPage(page);
    const city = testCities[1];

    searchPage.goToSearchPage();
    await expect(searchPage.searchInput).toBeVisible();

    await searchPage.fillInSearchBar(city);
    await searchPage.submitSearch();

    await searchPage.expectUrlEquals(expect, `https://www.geolocation.space/result?city=${city}`);    
  });

  test("Search with key Enter", async ({page}) => {
    const searchPage = new SearchPage(page);
    const city = testCities[1];

    searchPage.goToSearchPage();
    await expect(searchPage.searchInput).toBeVisible();

    await searchPage.fillInSearchBar(city);
    await page.keyboard.press("Enter");

    await searchPage.expectUrlEquals(expect, `https://www.geolocation.space/result?city=${city}`);  
  })
})