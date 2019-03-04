var iapConfig = {
  /* Configurations for HTTP request */
  requestDefaults: {
    /*
       Please refer to the request module documentation here:
       https://www.npmjs.com/package/request#requestoptions-callback
       */
  },
  /*
   Please refer to the voltrue2/in-app-purchase documentation here:
   https://github.com/voltrue2/in-app-purchase
   */

  /* Configurations for Apple */
  appleExcludeOldTransactions: false, // if you want to exclude old transaction, set this to true. Default is false
  applePassword: "abcdef...", // this comes from iTunes Connect (You need this to valiate subscriptions)

  /* Configurations for Google Play */
  googlePublicKeyPath: "./google_pub", // this is the path to the directory containing iap-sanbox/iap-live files
  googlePublicKeyStrSandBox: "iap-sandbox", // this is the google iap-sandbox public key string
  googlePublicKeyStrLive: "iap-live", // this is the google iap-live public key string

  googleAccToken: "abcdef...", // optional, for Google Play subscriptions
  googleRefToken: "dddd...", // optional, for Google Play subscritions
  googleClientID: "aaaa", // optional, for Google Play subscriptions
  googleClientSecret: "bbbb", // optional, for Google Play subscriptions

  // Configurations for Google Service Account validation: You can validate with just packageName, productId, and purchaseToken
  googleServiceAccount: {
    clientEmail:
      "<client email from Google API service account JSON key file>,",
    privateKey:
      "<private key string from Google API service account JSON key file>"
  },

  /* Configurations all platforms */
  test: true, // For Apple and Googl Play to force Sandbox validation only
  verbose: false // Output debug logs to stdout stream
};

var serviceConfig = {
  //port of your service, ask your provider which ports are free to use
  port: 9001,
  //probably you only want to validate your own products
  appDomain: "com.yourdomain",
  //maybe you want to return valid for some stores bc. you dont have all data ready yet...
  // possible entries are "android-playstore" and "ios-appstore" atm
  alwaysValidStores: ["android-playstore"],
  //sometimes we need to see what exactly is send to the service (e.g. to get some requests for testing)
  logFullRequest: false
};

module.exports = {
  iap: iapConfig,
  service: serviceConfig
};
