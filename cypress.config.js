const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      apiBaseUrl: "https://challenge.test.local/challenge/api/v1",
      login: "/user/login",
      userInfo: "/user/info",
      wallet: "/wallet",
      transaction: "/transaction",
      transactions: "/transactions",
    }
  },
});
