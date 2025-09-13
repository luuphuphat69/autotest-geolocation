export class ResultPage {
    RESULT_BASE_URL = 'https://www.geolocation.space/result';
    constructor(page) {
        this.page = page;
        this.filterdropdown = page.locator(".filter-select");
        this.filterInput = page.getByPlaceholder("Filter value...");
        this.applyfilterButton = page.locator(".filter-button");
        this.resetfilterButton = page.locator(".reset-button");
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

    async resetFilter() {
        await this.resetFilter.click();
    }
}