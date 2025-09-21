import { expect, test } from "@playwright/test";
import { ResultPage } from "../../../../model/ResultPage";
import { listCities, dropdownOptions, filterValues } from "../data";

test.describe("apply filter", () => {
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

test.describe('remove filter', () => {
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