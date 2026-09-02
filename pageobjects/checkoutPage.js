import { $, $$ } from '@wdio/globals'

class checkoutPage {

    get checkOutBtn() { return $('button#checkout') }
    get firstNameInput() { return $('#first-name'); }
    get lastNameInput() { return $('#last-name'); }
    get postalCodeInput() { return $('#postal-code'); }
    get continueBtn() { return $('#continue'); }
    get finishBtn() { return $('#finish'); }
    get confirmationHeader() { return $('.complete-header'); }

    async checkout() {
        await this.checkOutBtn.click();
    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.firstNameInput.setValue(firstName);
        await this.lastNameInput.setValue(lastName);
        await this.postalCodeInput.setValue(postalCode);
        await this.continueBtn.click();
    }

    async getOrderSummary() {
        const valueLabels = await $$('.summary_value_label');
        const payment  = await valueLabels[0].getText();   
        const shipping = await valueLabels[1].getText();   
        const productName = await $('.cart_item .inventory_item_name').getText();

        const itemTotalText = await $('.summary_subtotal_label').getText();
        const taxText       = await $('.summary_tax_label').getText();   
        const totalText     = await $('.summary_total_label').getText();  
        const toNumber = (text) => parseFloat(text.replace(/[^0-9.]/g, ''));

        return {
            payment,
            shipping,
            productName,
            itemTotal: toNumber(itemTotalText),
            tax:       toNumber(taxText),
            total:     toNumber(totalText),
        };
    }

    async finishOrder() {
        await this.finishBtn.click();
    }

    async getConfirmationMessage() {
        return await this.confirmationHeader.getText();
    }
}

export default new checkoutPage();
