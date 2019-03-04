# Simple validation service for j3k0/cordova-plugin-purchase

A very basic receipt validation service to be used with [j3k0/cordova-plugin-purchase](https://github.com/j3k0/cordova-plugin-purchase),  
build with [Express](https://expressjs.com/), and
[this excellent node.js module for in-app purchase](https://github.com/voltrue2/in-app-purchase).

## Setup

After cloning the repo and the initial `npm install` you need to create your custom `config.js`.  
You need to set your own login credentials for Apple App Store and Google Play Store.
You also need to set some customizations for the service, e.g. the listening-port, your Apps-Domain etc.  
A template and some explanations for this config-file can be found in [`config.template.js`](./config.template.js).

```sh
 % cp config.template.js config.js
 % vim config.js
```

Any necessary change can be done in `config.js`, which is not tracked with git!  
This way you can `git pull` a new version if there are any improvements in the future.  
If you think any other behavior should be handled with an extra setting/config please file an issue or offer a pull request.   

### Inside of j3k0/cordova-plugin-purchase

Please see the [official example project](https://github.com/Fovea/cordova-plugin-purchase-demo/blob/master/www/js/index.js).

The relevant [line](https://github.com/Fovea/cordova-plugin-purchase-demo/blob/6637a1f29ffa63cdd5b8a0c51a3209a2116a419f/www/js/index.js#L68) is
```js
// Enable remote receipt validation
store.validator = "https://api.fovea.cc:1982/check-purchase";
```

change it to
```js
// Enable remote receipt validation
store.validator = "https://localhost:9001/";
```
or wherever your own service is running now (Port 9001 is default from `config.template.js`).

## Run

You can start the service manually via
```sh
 $ node app.js
```
or via `npm start`.  
All logs will be printed to stdout.

For running the service permanently you should consider something like [daemontools](http://cr.yp.to/daemontools.html), which also handles logging.

## Tests

There are some tests defined (run `npm test` to try out), but they rely on some requests-data inside of `tests/requests/` directory that contain receipts-data. These requests/receipts are NOT part of this repository, but you can create your own requests relatively simple, please see the [tests-README](./tests/README.md) for details. 

Manually testing some custom requests can be done with [Advanced REST Client](https://install.advancedrestclient.com) (also available as Chrome Extension!).

## Insights
The j3k0/cordova-plugin-purchase plugin expects __return-data__ similar to this:
```json
{
  "ok": true | false, //was validation sucessful?
  "data": {
    "code": 1234, //a number!
    "error": {
      "message": "YXZ"
    }
  }
}
```
whereas `code` for expired receipts has to be:
```JavaScript
//the cordova-purchase-plugin expects this number for expired stuff
const PURCHASE_EXPIRED_CODE = 6778003;`
```

Every return-status other than `200` is interpreted as the receipt being invalid, only answers with (at least) `{ok:true}` are interpreted as valid.
