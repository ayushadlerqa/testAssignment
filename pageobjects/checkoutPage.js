import { $, $$ } from '@wdio/globals'

class checkoutPage {

    get checkOutBtn() { return $('button#checkout') }
    get firstNameInput() { return $('#first-name'); }
    get lastNameInput() { return $('#last-name'); }
    get postalCodeInput() { return $('#postal-code'); }
    get continueBtn() { return $('#continue'); }
    get finishBtn() { return $('#finish'); }
    get confirmationHeader() { return $('.complete-header'); }
    get summaryLabels() { return $$('.summary_value_label') }
    get itemName() { return $('.cart_item .inventory_item_name')}
    get itemTotal() { return $('.summary_subtotal_label') }
    get taxLabel() { return $('.summary_tax_label') }
    get totalLabel() { return $('.summary_total_label') }

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
        const valueLabels = await this.summaryLabels;
        const payment  = await valueLabels[0].getText();   
        const shipping = await valueLabels[1].getText();   
        const productName = await this.itemName.getText();

        const itemTotalText = await this.itemTotal.getText();
        const taxText       = await this.taxLabel.getText();   
        const totalText     = await this.totalLabel.getText();  
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
