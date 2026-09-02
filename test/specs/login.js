import { expect } from '@wdio/globals'
import loginPage from '../../pageobjects/loginPage.js'
import productPage from '../../pageobjects/productPage.js'
import env from 'dotenv';

describe('My Login application', () => {
    
    it('should login with valid credentials', async () => {

        // Open the login page
        await loginPage.open()

        // Perform login with valid credentials
        await loginPage.login(process.env.username, process.env.password)

        // Verify that the dashboard header is displayed and contains the expected text
        await expect(productPage.dashboardHeader).toBeExisting()
        await expect(productPage.dashboardHeader).toHaveText(
            expect.stringContaining('Swag Labs'))    
    })
})

