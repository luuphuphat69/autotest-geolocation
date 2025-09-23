import {expect, test} from "@playwright/test";
import {ResultPage} from "../../../../model/ResultPage";
import {listCities} from "../data";

test("Open weather dialog", async({page}) => {
    const resultPage = new ResultPage(page);
    await resultPage.goToResultPage(listCities[1]);

    const selectedRow = await page.locator(".city-table thead tr th", {hasText: listCities[1]});
    await selectedRow.click();
    await expect(page.getByRole("dialog")).toBeVisible();
})