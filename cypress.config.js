const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://sgv2.otimizasistemas.com.br/#',

    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env.login_url = config.baseUrl + 'login';
      return config
    
    },
  },
  
});
