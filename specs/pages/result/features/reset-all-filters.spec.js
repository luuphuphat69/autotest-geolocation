import { expect, test } from "@playwright/test";
import { ResultPage } from "../../../../model/ResultPage";
import { listCities, dropdownOptions, filterValues } from "../../../../testdata/result-data";

test('reset all', async ({ page }) => {
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