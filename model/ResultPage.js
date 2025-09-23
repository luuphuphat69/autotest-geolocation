export class ResultPage {
    RESULT_BASE_URL = 'https://www.geolocation.space/result';
    constructor(page) {
        this.page = page;
        this.filterdropdown = page.locator(".filter-select");
        this.filterInput = page.getByPlaceholder("Filter value...");
        this.applyfilterButton = page.locator(".filter-button");
        this.removefilterButton = page.locator(".remove-filter");
        this.filterTagLabel = page.locator(".filter-tag-label");
        this.filterTagValue = page.locator(".filter-tag-value");
        this.resetAllFilterButton = page.locator(".reset-button");
    }

    async goToResultPage(searchTerm) {
        await this.page.goto(this.RESULT_BASE_URL + `?city=${searchTerm}`)
    }

    async selectFilterDropDownOption(optionValue) {
        await this.filterdropdown.selectOption({ label: optionValue }); // safer than index
    }

    async inputFilterValue(value) {
        await this.filterInput.fill(value)
    }

    async applyFilter() {
        await this.applyfilterButton.click();
    }

    async removeFilter() {
        await this.removefilterButton.click();
    }

    async resetAllFilter() {
        await this.resetAllFilterButton.click();
    }
}