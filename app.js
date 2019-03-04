/*
 * load configs and prepare variables we will use later
 */
var config = require("./config");
var productId = "";
var storeType = "";

if (!config) {
  console.error("*** No config.js found, please see README.md ***");
  return;
}

/*
 * consts we need
 */
const PURCHASE_EXPIRED_CODE = 6778003; //the cordova-purchase-plugin expects this number!

/*
 * log our events to stdout (not when testing!)
 */
function logEventDone(eventDone) {
  if (!(process.env.NODE_ENV == "test")) {
    // eslint-disable-next-line
    console.log(`${productId} / ${storeType}: ${eventDone}`);
  }
}

/*
 * prepare the validator
 */
var iap = require("in-app-purchase");
iap.config(config.iap);
iap
  .setup()
  .then(() => {
    console.log("*** Finished setting up in-app-purchase! ***");
  })
  .catch(error => {
    console.error("*** Error during setup of in-app-purchase: ***");
    console.error(error);
    return;
  });

/*
 * prepare the express server
 */
const express = require("express");
const app = express();

// enable json parsing
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

// enable CORS
var cors = require("cors");
app.use(cors());

// enable logging (not while testing!)
// we log to stdout and use multilog from our provider
if (!(process.env.NODE_ENV == "test")) {
  var morgan = require("morgan");
  app.use(
    morgan(
      // eslint-disable-next-line
      ':method :url :status [HTTP/:http-version] [:res[content-length]] (":user-agent" / ":referrer")'
    )
  );
}

/*
 * define get-route
 */
app.get("/", (req, res) => {
  res.send("<pre>Status: running</pre>");
});

/*
 * manage data offered by our apps, see
 * https://github.com/j3k0/cordova-plugin-purchase/blob/a1002c559686e555745de07bf531222c2dcb9e3a/www/store-ios.js#L1334
 */
app.post("/", (req, res) => {
  //log the full request (if enabled)
  if (config.service.logFullRequest) {
    console.log(JSON.stringify(req.body, null, 2));
  }

  //we need to make sure our body is well-formed *gnihi*
  if (
    req.body &&
    req.body.id &&
    req.body.transaction &&
    req.body.transaction.type
  ) {
    //there is a productId and we know the storeType
    productId = req.body.id;
    storeType = req.body.transaction.type;
  } else {
    //we only want to validate our own products...
    logEventDone("400 (Bad Request), malformed body");
    res.status(400).end();
    return;
  }

  //we only want to validate our own products...
  if (productId.indexOf(config.service.appDomain) != 0) {
    logEventDone(`403 (Forbidden), no ${config.service.appDomain} product`);
    res.status(403).end();
    return;
  }

  //depending on our transaction type there we need to get our receipt
  var receipt;
  if (req.body.transaction.type == "ios-appstore") {
    receipt = req.body.transaction.appStoreReceipt;
  } else if (req.body.transaction.type == "android-playstore") {
    receipt = req.body.transaction.receipt;
  } else {
    // we only have Android and iOS Apps, ignore all other!
    logEventDone("403 (Forbidden), no Android or iOS product");
    res.status(403).end();
    return;
  }

  //no receipt found, bad request
  if (!receipt) {
    logEventDone("Bad Request (400), no receipt found");
    res.status(400).end();
    return;
  }

  //check if any store-type shall be always-valid...
  if (config.service.alwaysValidStores.indexOf(storeType) != -1) {
    logEventDone(`Valid (as always for ${storeType})`);
    res.json({
      ok: true,
      data: {}
    });
    return;
  }

  iap
    .validate(receipt)
    .then(validatedData => {
      //console.log(validatedData);

      //convert the answer to something readable
      var purchaseData = iap.getPurchaseData(validatedData); //Array!!
      //console.log(purchaseData);

      //the only thing the cordova-plugin checks if the validator returns PURCHASE_EXPIRED_CODE,
      //so this is the only thing we need to handle atm!
      var isExpired = false;
      purchaseData.forEach(purchase => {
        //only check/combine purchases/answers of the product this request is related to!
        if (purchase.productId == req.body.id) {
          isExpired = isExpired || iap.isExpired(purchase);
        }

        // we could also check for iap.isCanceled(purchase)); to see if it was canceled!
        //canceled means the user asked for a refund
        //this should be handled by the cordova-plugin, atm no need to handle it here too
      });

      if (isExpired) {
        logEventDone("Expired receipt found"); //Expired receipt are still valid!
        res.json({
          ok: false,
          data: {
            code: PURCHASE_EXPIRED_CODE
          }
        });
      } else {
        //if it is not exired, then it probably is valid...
        logEventDone("Valid");
        res.json({
          ok: true, //indicates the provided receipt was valid
          data: {}
        });
      }
    })
    .catch(error => {
      //validation failed!
      logEventDone(`400 (Bad Request), error during validation: ${error}`);
      res.status(400).end();
    });
});

//start server
app.listen(config.service.port, () => {
  console.log(
    `*** in-app-purchase-validation-server (${
      config.service.appDomain
    }) listening on port ${config.service.port} ***`
  );
});

//export app, for testing porposes
module.exports = app;
