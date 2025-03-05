/** 
* This describe is testing depositing and withdrawing funds functionalities with negative tests 
*/
describe('Deposit and Withdrawal - Negative', ()=> {
    
    let authToken, userId, transactionId, transactionBody;
    
    before("LogIn", () => {
        cy.logInReq().then((login) => {
            authToken = login.token;
            userId = login.userId;
        })
    })

    it('Deposit EUR - negative amount', ()=> {
        transactionBody = {
            "currency": "EUR",
            "amount": -100,
            "type": "debit"
          }
        cy.makeTransaction(authToken, transactionBody, 400).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Deposit USD - negative amount', ()=> {
        transactionBody = {
            "currency": "USD",
            "amount": -100,
            "type": "debit"
          }
        cy.makeTransaction(authToken, transactionBody, 400).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Deposit Wrong currency', ()=> {
        transactionBody = {
            "currency": "RSD",
            "amount": 100,
            "type": "debit"
          }
        cy.makeTransaction(authToken, transactionBody, 400).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Deposit EUR - wrong type of transaction', ()=> {
        transactionBody = {
            "currency": "EUR",
            "amount": 100,
            "type": "uplata"
          }
        cy.makeTransaction(authToken, transactionBody, 400).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Deposit EUR - wrong WalletID', ()=> {
        transactionBody = {
            "currency": "EUR",
            "amount": 100,
            "type": "debit"
          }
        cy.makeTransactionWrongWalletID(authToken, transactionBody, 403).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Withdraw EUR - negative amount', ()=> {
        transactionBody = {
            "currency": "EUR",
            "amount": -100,
            "type": "credit"
          }
        cy.makeTransaction(authToken, transactionBody, 400).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Withdraw USD - negative amount', ()=> {
        transactionBody = {
            "currency": "USD",
            "amount": -100,
            "type": "credit"
          }
        cy.makeTransaction(authToken, transactionBody, 400).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Withdraw Wrong currency', ()=> {
        transactionBody = {
            "currency": "RSD",
            "amount": 100,
            "type": "credit"
          }
        cy.makeTransaction(authToken, transactionBody, 400).then((transaction) => {
            transactionId = transaction
        })
    })

    it('Withdraw EUR - wrong WalletID', ()=> {
        transactionBody = {
            "currency": "EUR",
            "amount": 100,
            "type": "credit"
          }
        cy.makeTransactionWrongWalletID(authToken, transactionBody, 403).then((transaction) => {
            transactionId = transaction
        })
    })
})