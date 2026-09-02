import { expect } from '@wdio/globals'
import loginPage from '../../pageobjects/loginPage.js'
import productPage from '../../pageobjects/productPage.js'
import cartPage from '../../pageobjects/cartPage.js'
import checkoutPage from '../../pageobjects/checkoutPage.js'
import env from 'dotenv';

describe('Add product to cart and place an order', () =>{

    it('Verify that a product can be added to the cart and an order can be placed',
      async () =>{
        
        //Login to the application
        await loginPage.open()
        await loginPage.login(process.env.username, process.env.password)

        //Navigate to the product page and add a product to the cart
        const selectedProduct = await productPage.selectProductAndAddToCart();
        await cartPage.navigateToCart();
        const cartItems = await cartPage.getCartItems();

        //match the selected product with the product in the cart
        expect(cartItems).toContain(selectedProduct);

        //Proceed to checkout and fill in the checkout information
        await checkoutPage.checkout();
        await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');

        //Validate the order summary on the checkout overview page
        const summary = await checkoutPage.getOrderSummary();
        expect(summary.productName).toEqual(selectedProduct)
        expect(summary.payment).toContain('SauceCard');
        expect(summary.shipping).toContain('Pony Express');
       
        const expectedTotal = Math.round((summary.itemTotal + summary.tax) * 100) / 100;
        expect(summary.total).toEqual(expectedTotal);

        await checkoutPage.finishOrder();
        const confirmation = await checkoutPage.getConfirmationMessage();
        expect(confirmation).toContain('Thank you for your order');
     
      })

})