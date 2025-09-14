import { test, expect } from '@playwright/test';
import { ResultPage } from '../../model/ResultPage';

const RESULT_BASE_URL = `https://www.geolocation.space/result`;
const listCities = ['Pleiku', 'New York', 'Ohio'];
const dropdownOptions = [
  { id: "city", label: "City" },
  { id: "state", label: "State / Province" },
  { id: "country", label: "Country" },
  { id: "latitude", label: "Latitude" },
  { id: "longitude", label: "Longitude" },
];
const filterValues = ['abcdf', '34324', '!@$#%^&*'];

test('has title', async ({ page }) => {
  await page.goto(`${RESULT_BASE_URL}?city={}`);
});

// Parameterized dropdown filter tests
test.describe("Apply filter", () => {
  for (const city of listCities) {
    for (const option of dropdownOptions) {
      for (const value of filterValues) {
        test(
          `apply filter [${option.id}] with value "${value}" for city "${city}"`,
          async ({ page }) => {
            const resultPage = new ResultPage(page);
            await resultPage.goToResultPage(city);

            // Select dropdown option
            await resultPage.selectFilterDropDownOption(option.label);

            // Input filter value
            await resultPage.inputFilterValue(value);

            // Apply filter
            await resultPage.applyFilter();

            // Expect label
            await expect(resultPage.filterTagLabel).toHaveText(option.id + ":");

            // Expect value
            await expect(resultPage.filterTagValue).toHaveText(value);
          }
        );
      }
    }
  }
});

test.describe('Remove filter', () => {
  for (const option of dropdownOptions) {
    test(`remove ${option.label} filter`, async ({ page }) => {
      const resultPage = new ResultPage(page);

      await resultPage.goToResultPage(listCities[1]);

      await resultPage.selectFilterDropDownOption(option.label);
      await resultPage.inputFilterValue(filterValues[0]);
      await resultPage.applyFilter();

      await resultPage.removeFilter();

      // Wait for table to show all rows again
      await expect(page.locator("table tbody tr")).toHaveCount(20);

      await expect(resultPage.filterTagLabel).not.toBeVisible();
      await expect(resultPage.filterTagValue).not.toBeVisible();
    });
  }
});

test('Reset all', async ({ page }) => {
  const resultPage = new ResultPage(page);

  // Go to result page
  await resultPage.goToResultPage(listCities[1]);

  for (const option of dropdownOptions) {
    await resultPage.selectFilterDropDownOption(option.label);
    await resultPage.inputFilterValue(filterValues[0]);
    await resultPage.applyFilter();
  }

  await resultPage.resetAllFilter();

  await expect(resultPage.filterTagLabel).not.toBeVisible();
  await expect(resultPage.filterTagValue).not.toBeVisible();
  await expect(resultPage.filterInput).toBeEmpty();
});
