import { expect } from "@playwright/test";
export class SearchPage {
    SEARCH_BASE_URL = 'https://www.geolocation.space/search';
    constructor(page) {
        this.page = page;
        this.searchInput = page.locator("#citySearch");
        this.searchButton = page.locator("#searchBtn");
        this.autoCompleteList = page.locator(".autocomplete-list");
        this.showScheduleButton = page.locator("#showScheduleBtn");
    }

    async goToSearchPage() {
        await this.page.goto(this.SEARCH_BASE_URL);
    }

    async fillInSearchBar(term) {
        await this.searchInput.fill(term);
    }

    async submitSearch(){
        await this.searchButton.click()
    }
    
    async clearSearchBar() {
        await this.searchInput.clear();
    }

    async waitForAutocompleteVisible(options = { timeout: 10000 }) {
        await this.autoCompleteList.waitFor({ state: 'visible', timeout: options.timeout });
    }

    async waitForAutocompleteHidden(options = { timeout: 10000 }) {
        await this.autoCompleteList.waitFor({ state: 'hidden', timeout: options.timeout });
    }

    async firstSuggestion() {
        return this.autoCompleteList.locator('li').first();
    }

    async clickFirstSuggestion() {
        const first = this.autoCompleteList.locator('li').first();
        await first.click();
    }

    async expectTitleContains(expect, text) {
        await expect(this.page).toHaveTitle(new RegExp(text, 'i'));
    }

    async expectUrlEquals(expect, url) {
        await expect(this.page).toHaveURL(url);
    }
}