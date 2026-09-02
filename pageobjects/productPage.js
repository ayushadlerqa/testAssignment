import {$}from '@wdio/globals'

class productPage {

    get dashboardHeader() { return $('div.app_logo'); }
    
    async getDashboardHeaderText() {
        return await this.dashboardHeader.getText();
    }

    async selectProductAndAddToCart(){
       const products = await $$('div.inventory_item')
       const firstProduct = products[0]
       const productName = await firstProduct.$('div.inventory_item_name').getText();
       const addToCartButton = await firstProduct.$('.//button[normalize-space()="Add to cart"]');
       await addToCartButton.click();
       return productName;
    }

}

export default new productPage();
