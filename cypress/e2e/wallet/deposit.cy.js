import { getRandomInt } from "../../helpers/utils.cy.js";

/** 
* This describe is going through complete user's jurney of depositing funds 
*/
describe('Deposit', ()=> {
    
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
        cy.getWalletDetails(authToken, true)
    })

    it('Deposit EUR', ()=> {
        const randomNum = getRandomInt(100, 200)
        transactionBody = {
            "currency": "EUR",
            "amount": randomNum,
            "type": "debit"
          }
        cy.makeTransaction(authToken, transactionBody, 200).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Deposit USD', ()=> {
        const randomNum = getRandomInt(100, 200)
        transactionBody = {
            "currency": "USD",
            "amount": randomNum,
            "type": "debit"
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