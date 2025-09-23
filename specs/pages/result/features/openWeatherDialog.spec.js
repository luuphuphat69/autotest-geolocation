import {expect, test} from "@playwright/test";
import {ResultPage} from "../../../../model/ResultPage";
import {listCities} from "../../../../testdata/result-data";

test("open weather dialog", async({page}) => {
    const resultPage = new ResultPage(page);
    await resultPage.goToResultPage(listCities[1]);

    const rows = page.locator(".city-table tbody tr");
    const selectedRow = rows.nth(1);

    await selectedRow.click();
    await expect(page.getByRole("dialog")).toBeVisible();
})