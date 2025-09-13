import { test, expect } from '@playwright/test';
import { ResultPage } from '../../model/ResultPage';

const RESULT_BASE_URL = `https://www.geolocation.space/result`;
const listCities = ['Pleiku', 'New York', 'Ohio'];
const dropdownOptions = [
  'Country',
  'City',
  'State / Province',
  'Latitude',
  'Longitude'
];
const filterValues = ['abcdf', '34324', '!@$#%^&*'];

test('has title', async ({ page }) => {
  await page.goto(`${RESULT_BASE_URL}?city={}`);
});

// Parameterized dropdown filter tests
test.describe("Filter dropdown", () => {
  for (const city of listCities) {
    for (const option of dropdownOptions) {
      test(`select [${option}] filter dropdown for city: ${city}`, async ({ page }) => {
        const resultPage = new ResultPage(page);
        await resultPage.goToResultPage(city);

        await resultPage.selectFilterDropDownOption(option);

        const content = await resultPage.filterdropdown.textContent();
        expect(content).toContain(option);
      });
    }
  }
})


test.describe("Filter input", () => {
  for (const city of listCities) {
    test.describe(`Filter input for city: ${city}`, () => {
      test('Input chars + number + special', async ({ page }) => {
        const resultPage = new ResultPage(page);
        await resultPage.goToResultPage(city);

        for (const value of filterValues) {
          await resultPage.inputFilterValue(value);
          await expect(resultPage.filterInput).toHaveValue(value);
        }
      });
    });
  }
})