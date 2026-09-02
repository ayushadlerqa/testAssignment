import { $ } from '@wdio/globals'

class cartPage {

    get addToCart() { return $('a.shopping_cart_link') }
    
    
    async navigateToCart() {
        await this.addToCart.click();
    }

    async getCartItems() {
        const cartItems = await $$('//div[@class="cart_item_label"]');
        const itemNames = [];
        for (const item of cartItems) {
            const itemName = await item.$('//div[@class="cart_item_label"]/a').getText();
            itemNames.push(itemName);
        }
        return itemNames;
    }

}

export default new cartPage();