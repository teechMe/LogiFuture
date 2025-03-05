//Validating Login response
export function assertLoginResponse(response) {
    expect(response.status).eq(200)
    expect(response.body).to.have.property('token')
    expect(response.body.token).not.eq(null)
    expect(response.body).to.have.property('refreshToken')
    expect(response.body.refreshToken).not.eq(null)
    expect(response.body).to.have.property('expiry')
    expect(response.body.expiry).not.eq(null)
    expect(response.body).to.have.property('userId')
    expect(response.body.userId).not.eq(null)

    return response.body;
}

//Validating Get User Details response
export function assertGetUserDetails(response, userDetails) {
    expect(response.status).eq(200)
    expect(JSON.stringify(response.body)).eq(JSON.stringify(userDetails))    
}

//Validating Get Wallet Details response
export function assertGetWalletDetails(response, emptyWallet, walletId) {
    expect(response.status).eq(200)
    expect(response.body.walletId).eq(walletId)
    expect(response.body).to.have.property('currencyClips')

    if (emptyWallet) {
        expect(response.body.currencyClips).to.have.length(0)
    } else {
    expect(response.body.currencyClips).to.have.length(2)
    response.body.currencyClips.forEach(currency => {
        expect(currency).to.have.property('currency')
        expect(currency.currency).to.be.oneOf(['EUR', 'USD'])
        expect(currency).to.have.property('balance')
        expect(currency.balance).to.be.above(0)
        expect(currency).to.have.property('lastTransaction')
        expect(currency.lastTransaction).not.to.eq(null)
        expect(currency).to.have.property('transactionCount')
        expect(currency.transactionCount).to.be.above(0)
        })
    }
    expect(response.body.createdAt).not.eql(null)
    expect(response.body.updatedAt).not.eql(null)
}

//Validating Make Transaction response
export function assertMakeTransaction(response, reqBody, statusCode) {
    expect(response.status).eq(statusCode)
    if (statusCode === 200){
        expect(response.body).to.have.property('transactionId')
        expect(response.body.transactionId).not.to.eq(null)
        expect(response.body).to.have.property('status')
        expect(response.body.status).to.be.oneOf(['finished', 'pending'])
        expect(response.body).to.have.property('createdAt')
        expect(response.body.createdAt).not.to.eq(null)
        if (response.body.status === 'finished'){
            expect(response.body).to.have.property('currency')
            expect(response.body.currency).eq(reqBody.currency)
            expect(response.body).to.have.property('amount')
            expect(response.body.amount).eq(reqBody.amount)
            expect(response.body).to.have.property('type')
            expect(response.body.type).eq(reqBody.type)
            expect(response.body).to.have.property('outcome')
            expect(response.body).to.have.property('updatedAt')
            expect(response.body.updatedAt).not.to.eq(null)

            if(response.body.outcome === "denied"){
                return response.body.transactionId
            }
            expect(response.body.outcome).eq('approved')
        }
        return response.body.transactionId
    }
}

//Validating Get Transaction response
export function assertCheckTransaction(response, transactionId, transactionBody){
    expect(response.status).eq(200)
    expect(response.body).to.have.property('transactionId')
    expect(response.body.transactionId).to.eq(transactionId)
    expect(response.body).to.have.property('status')
    expect(response.body.status).to.be.oneOf(['finished', 'pending'])
    expect(response.body).to.have.property('createdAt')
    expect(response.body.createdAt).not.to.eq(null)
    if (response.body.status === 'finished'){
        expect(response.body).to.have.property('currency')
        expect(response.body.currency).eq(transactionBody.currency)
        expect(response.body).to.have.property('amount')
        expect(response.body.amount).eq(transactionBody.amount)
        expect(response.body).to.have.property('type')
        expect(response.body.type).eq(transactionBody.type)
        expect(response.body.outcome).eq('approved')
        expect(response.body).to.have.property('updatedAt')
        expect(response.body.updatedAt).not.to.eq(null)
        
        return "transactionSuccessful"
    } else {
        cy.log("Transaction is still pending, retrying...");
        return "transactionPending"
    }
}

//Validating Get All Transactions response
export function assertCheckAllTransactions(response, transactionId, transactionBody){
    expect(response.status).eq(200)
    expect(response.body).to.have.property('transactions')
    expect(response.body.transactions).not.have.length(0)
    expect(response.body.transactions[0]).to.have.property('transactionId')
    expect(response.body.transactions[0].transactionId).to.eq(transactionId)
    expect(response.body.transactions[0]).to.have.property('currency')
    expect(response.body.transactions[0].currency).eq(transactionBody.currency)
    expect(response.body.transactions[0]).to.have.property('amount')
    expect(response.body.transactions[0].amount).eq(transactionBody.amount)
    expect(response.body.transactions[0]).to.have.property('type')
    expect(response.body.transactions[0].type).eq(transactionBody.type)
    expect(response.body.transactions[0]).to.have.property('status')
    expect(response.body.transactions[0].status).to.be.oneOf(['finished', 'pending'])
    expect(response.body.transactions[0]).to.have.property('outcome')
    expect(response.body.transactions[0].outcome).eq('approved')
    expect(response.body.transactions[0]).to.have.property('createdAt')
    expect(response.body.transactions[0].createdAt).not.to.eq(null)
    expect(response.body.transactions[0]).to.have.property('updatedAt')
    expect(response.body.transactions[0].updatedAt).not.to.eq(null)
}