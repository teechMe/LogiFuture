import { credentials, xServiceID } from "../config";
import { subtractDate } from "../helpers/utils.cy.js";
import { assertLoginResponse, assertGetUserDetails, assertGetWalletDetails, assertMakeTransaction, assertCheckTransaction, assertCheckAllTransactions } from "../helpers/assertions";
const apiBaseUrl = Cypress.env("apiBaseUrl");
const loginApi = Cypress.env("login");
const userInfoApi = Cypress.env("userInfo");
const walletApi = Cypress.env("wallet");
const transactionApi = Cypress.env("transaction");
const transactionsApi = Cypress.env("transactions");

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * @summary This command is loging in specified user and returns authToken
 * @return {string} Authentication token
 * @author Nemanja Mitic
 */
Cypress.Commands.add("logInReq", () => {
    cy.request({
        method: 'POST',
        url: `${apiBaseUrl}${loginApi}`,
        headers: {
            'Content-Type': 'application/json',
            'X-Service-Id': xServiceID
        },
        body: credentials
    }).then((response) => {
        return assertLoginResponse(response)
    }) 
  });

  /**
 * @summary This command is geting user details
 * @param {string} authToken Authentication token from login
 * @param {string} userId UserID from login
 * @author Nemanja Mitic
 */
  Cypress.Commands.add("getUserDetails", (authToken, userId) => {
    cy.fixture('users').then((userDetails) => {
        cy.request({
            method: 'GET',
            url: `${apiBaseUrl}${userInfoApi}/${userId}`,
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            assertGetUserDetails(response, userDetails)
        }) 
    })
  });

 /**
 * @summary This command is geting wallet details of logged in user
 * @param {string} authToken Authentication token from login
 * @param {string} emptyWallet Switch key, can be true or false, 
 * depending if you are testing user's empty wallet or with transactions
 * @author Nemanja Mitic
 */
  Cypress.Commands.add('getWalletDetails', (authToken, emptyWallet) => {
    cy.fixture('users').then((data) => {
        const walletId = data.walletId;
        cy.request({
            method: "GET",
            url: `${apiBaseUrl}${walletApi}/${walletId}`,
            headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
            }
        }).then((response)=> {
            assertGetWalletDetails(response, emptyWallet, walletId)
    })
  })
})

 /**
 * @summary This command is making a transaction for logged in user
 * @param {string} authToken Authentication token from login
 * @param {string} reqBody Transaction request body
 * @param {string} reqBody Expected Status Code
 * @return {string} TransactionID
 * @author Nemanja Mitic
 */
  Cypress.Commands.add('makeTransaction', (authToken, reqBody, statusCode)=>{
    cy.fixture('users').then((data) => {
        const walletId = data.walletId;

        cy.request({
            method: "POST",
            url: `${apiBaseUrl}${walletApi}${walletId}${transactionApi}`,
            body: reqBody,
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response)=> {
            return assertMakeTransaction(response, reqBody, statusCode)
        })
    })
  })

 /**
 * @summary This command is checking a specific transaction of logged in user
 * @param {string} authToken Authentication token from login
 * @param {string} transactionId TransactionID, usualy from makeTransaction response
 * @param {string} transactionBody Transaction request body
 * @param {string} attempts How many retries of request are we running
 * @returns {string} value that indicates if transaction is pending
 * @author Nemanja Mitic
 */
  Cypress.Commands.add('checkTransaction', (authToken, transactionId, transactionBody, attempts)=>{
    if (attempts === 0) {
        throw new Error("Max retries reached: Transaction is still pending.");
    }

    cy.fixture('users').then((data) => {
        const walletId = data.walletId;
                cy.request({
                method: "GET",
                url: `${apiBaseUrl}${walletApi}${walletId}${transactionApi}/${transactionId}`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((response)=> {
                const status = assertCheckTransaction(response, transactionId, transactionBody)
                if (status === "transactionPending") {
                    cy.wait(2000)
                    cy.checkTransaction(authToken, transactionId, transactionBody, attempts - 1)
                  } else {
                    cy.log("Transaction successfully completed.")
                  }
            })
    })
  })

 /**
 * @summary This command is checking all transactions of logged in user
 * @param {string} authToken Authentication token from login
 * @param {string} transactionId TransactionID, usualy from makeTransaction response
 * @param {string} transactionBody Transaction request body
 * @author Nemanja Mitic
 */
  Cypress.Commands.add('getAllTransactions', (authToken, transactionId, transactionBody)=> {
    cy.fixture('users').then((data) => {
        const walletId = data.walletId;

        const latestDate=new Date().toISOString();

        cy.request({
            method: 'GET',
            url: `${apiBaseUrl}${walletApi}${walletId}${transactionsApi}`,
            qs: {
                page: 1,
                startDate: subtractDate(latestDate, 1),
                endDate: latestDate
            },
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response)=> {
            assertCheckAllTransactions(response, transactionId, transactionBody)
        })
    })
  })

/**
 * @summary This command is making a transaction for wrong user
 * @param {string} authToken Authentication token from login
 * @param {string} reqBody Transaction request body
 * @param {string} reqBody Expected Status Code
 * @author Nemanja Mitic
 */
   Cypress.Commands.add('makeTransactionWrongWalletID', (authToken, reqBody, statusCode)=>{
    cy.fixture('users').then((data) => {
        const walletId = data.walletId+123455;

        cy.request({
            method: "POST",
            url: `${apiBaseUrl}${walletApi}${walletId}${transactionApi}`,
            body: reqBody,
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response)=> {
            assertMakeTransaction(response, reqBody, statusCode)
        })
    })
  })