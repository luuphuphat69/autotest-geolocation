// @ts-check
import { test, expect } from '@playwright/test';
import { SearchPage } from '../../model/SearchPage';


test('has title', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.goToSearchPage();
  await searchPage.expectTitleContains(expect, 'Geolocation');
});

test.describe("Search suggestion", () => {
  test('search with suggestion - different cities', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goToSearchPage();

    await expect(searchPage.searchInput).toBeVisible();

    const testCities = ["Pleiku", "Ho Chi Minh", "Đà Nẵng"];

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
    await searchPage.goToSearchPage();

    await expect(searchPage.searchInput).toBeVisible();

    await searchPage.fillInSearchBar("Pleiku");
    await searchPage.waitForAutocompleteVisible({ timeout: 10000 });

    await searchPage.clearSearchBar();
    await expect(searchPage.autoCompleteList).not.toBeVisible();
  });

  test('search with suggestion - click on suggestion', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goToSearchPage();

    await expect(searchPage.searchInput).toBeVisible();

    let city = "Pleiku";
    await searchPage.fillInSearchBar(city);
    await searchPage.waitForAutocompleteVisible({ timeout: 10000 });

    await searchPage.clickFirstSuggestion();
    await searchPage.expectUrlEquals(expect, `https://www.geolocation.space/result?city=${city}`);
  });
});