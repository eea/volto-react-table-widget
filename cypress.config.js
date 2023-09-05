const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1280,
  defaultCommandTimeout: 5000,
  chromeWebSecurity: false,
  reporter: 'junit',
  video: true,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  reporterOptions: {
    mochaFile: 'cypress/reports/cypress-[hash].xml',
    jenkinsMode: true,
    toConsole: true,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
})
