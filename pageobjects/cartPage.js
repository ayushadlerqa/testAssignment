import { $, $$ } from '@wdio/globals'

class cartPage {

    // --- Locators ---
    get cartLink()  { return $('a.shopping_cart_link'); }
    get itemsList() { return $$('div.cart_item_label'); }

    // Selector applied *relative to* a single cart item (nested lookup).
    // Kept here with the other locators so all selectors live in one place.
    itemNameSelector = 'div.inventory_item_name';

    async navigateToCart() {
        await this.cartLink.click();
    }

    async getCartItems() {
        const items = await this.itemsList;
        const itemNames = [];
        for (const item of items) {
            // Read only the product name, not the whole label (desc/price/Remove)
            itemNames.push(await item.$(this.itemNameSelector).getText());
        }
        return itemNames;
    }

}

export default new cartPage();
