import { expect, test } from "@playwright/test";
import { ResultPage } from "../../../../model/ResultPage";
import { listCities, columnsList } from "../../../../testdata/result-data";

test.describe('sorting column', () => {
  for (const item of columnsList) {
    test(`sorting ${item.col} column - increase`, async ({ page }) => {
      const resultPage = new ResultPage(page);
      await resultPage.goToResultPage(listCities[1]);

      // Find the column by its text
      const columnElement = page.locator('.city-table thead th', { hasText: item.col });
      await columnElement.click();

      await expect(resultPage.filterTagLabel).toHaveText('Sort:');
      await expect(resultPage.filterTagValue).toHaveText(item.tagValue1);
    });

    test(`sorting ${item.col} column - decrease`, async ({ page }) => {
      const resultPage = new ResultPage(page);
      await resultPage.goToResultPage(listCities[1]);

      // Find the column by its text
      const columnElement = page.locator('.city-table thead th', { hasText: item.col });
      await columnElement.click();
      await columnElement.click();

      await expect(resultPage.filterTagLabel).toHaveText('Sort:');
      await expect(resultPage.filterTagValue).toHaveText(item.tagValue2);
    });
  }
});

test.describe("remove sort filter", () => {
  for (const item of columnsList) {
    test(`remove ${item.col} sort filter - increase`, async ({ page }) => {
      const resultPage = new ResultPage(page);
      await resultPage.goToResultPage(listCities[1]);

      // Find the column by its text
      const columnElement = page.locator('.city-table thead th', { hasText: item.col });
      await columnElement.click();
      await resultPage.removeFilter();

      // Wait for table to show all rows again
      await expect(page.locator("table tbody tr")).toHaveCount(20);

      await expect(resultPage.filterTagLabel).not.toBeVisible();
      await expect(resultPage.filterTagValue).not.toBeVisible();
    })
  }
})
