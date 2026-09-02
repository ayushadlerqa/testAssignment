import { $, $$ } from '@wdio/globals'

class cartPage {

    // --- Locators ---
    get cartLink()  { return $('a.shopping_cart_link'); }
    get itemsList() { return $$('div.cart_item_label'); }

    itemNameSelector = 'div.inventory_item_name';

    async navigateToCart() {
        await this.cartLink.click();
    }

    async getCartItems() {
        const items = await this.itemsList;
        const itemNames = [];
        for (const item of items) {
            itemNames.push(await item.$(this.itemNameSelector).getText());
        }
        return itemNames;
    }

}

export default new cartPage();
