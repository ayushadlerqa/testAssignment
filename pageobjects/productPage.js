import { $, $$ } from '@wdio/globals'

class productPage {

    // --- Locators ---
    get dashboardHeader() { return $('div.app_logo'); }
    get productItems()    { return $$('div.inventory_item'); }

    productNameSelector     = 'div.inventory_item_name';
    addToCartButtonSelector = './/button[normalize-space()="Add to cart"]';

    async getDashboardHeaderText() {
        return await this.dashboardHeader.getText();
    }

    async selectProductAndAddToCart() {
        const products = await this.productItems;
        const firstProduct = products[0];

        const productName = await firstProduct.$(this.productNameSelector).getText();
        await firstProduct.$(this.addToCartButtonSelector).click();

        return productName;
    }

}

export default new productPage();
