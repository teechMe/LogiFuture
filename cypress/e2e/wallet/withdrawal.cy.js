import { getRandomInt } from "../../helpers/utils.cy.js";

/** 
* This describe is going through complete user's jurney of withdrawing funds 
*/
describe('Withdrawal', ()=> {
    
    let authToken, userId, transactionId, transactionBody;
    
    before("LogIn", () => {
        cy.logInReq().then((login) => {
            authToken = login.token;
            userId = login.userId;
        })
    })

    it ('Get user details', () => {
        cy.getUserDetails(authToken, userId)
    })

    it('Get wallet details - Before transaction', ()=> {
        cy.getWalletDetails(authToken, false)
    })

    it('Withdraw EUR', ()=> {
        const randomNum = getRandomInt(1, 50)
        transactionBody = {
            "currency": "EUR",
            "amount": randomNum,
            "type": "credit"
          }
        cy.makeTransaction(authToken, transactionBody, 200).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Withdraw USD', ()=> {
        const randomNum = getRandomInt(1, 50)
        transactionBody = {
            "currency": "EUR",
            "amount": randomNum,
            "type": "credit"
          }
        cy.makeTransaction(authToken, transactionBody, 200).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Check last transaction', () => {
        cy.checkTransaction(authToken, transactionId, transactionBody, 3)
    })

    it('Check all transactions', ()=> {
        cy.getAllTransactions(authToken, transactionId, transactionBody)
    })

    it('Get wallet details - After transaction', ()=> {
        cy.getWalletDetails(authToken, false)
    })
})