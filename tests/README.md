The Tests require some receipts / requests - these are NOT provided here!

Receipts are always related to the specific product that you created within your Apple App Store or Google Play Store account.

Receipts can only be validated by this very account (see [`config.template.js`](../config.template.js)).

Therefore you need to create your own requests, from your own products!

To do this, set `serviceConfig.logFullRequest` to true in your `config.js` - this will enable logging of the full request to the service!  
Now do some requests with your App (e.g.) buy a product while you have setup your running validation-service inside of the j3k0/cordova-plugin-purchase.  
All requests are now logged to stdout and you can store them.

The tests require the following files:

- `requests/expired_ios_subscription.json`
- `requests/valid_android_consumbale.json`
- `requests/valid_ios_consumbale.json`


Example for `requests/valid_android_consumable.json` (anonymized):
```json
{ "id": "com.example.app.smallcoffee",
  "alias": "Small Coffee Purchase",
  "type": "consumable",
  "state": "approved",
  "title": "Kleiner Kaffee",
  "description": "Spenden Sie für einen kleinen Kaffee um den Entwickler wach zu halten",
  "priceMicros": 990000,
  "price": "0,99 €",
  "currency": "EUR",
  "countryCode": null,
  "loaded": true,
  "canPurchase": false,
  "owned": false,
  "downloading": false,
  "downloaded": false,
  "additionalData": null,
  "transaction":
   { "type": "android-playstore",
     "id": "GPA.4321-1234-4321-12345",
     "purchaseToken": "dsfdsfdsfdsfdsfsdfdfafafsadqwevdsfvaedcverwgfadafdqwdkihiqwbcdqwucbqwicqwbcuqwbciquw",
     "receipt": {
       "orderId":"GPA.3308-0599-3547-38954",
       "packageName":"com.example.app",
       "productId":"com.example.app.smallcoffee",
       "purchaseTime":1541427967651,
       "purchaseState":0,
       "purchaseToken":"dsfdsfdsfdsfdsfsdfdfafafsadqwevdsfvaedcverwgfadafdqwdkihiqwbcdqwucbqwicqwbcuqwbciquw"
     },
    "signature": "dgsgsdgfIHUhuhiuIUHIUHIiuhUHIUNJLKOKJihjhuugIUJNOHNIUBVZGZFRguzgftzgtftzftt==" },
  "valid": true }
```

Example for `requests/valid_ios_consumable.json` (anonymized):
```json
{"id":"com.example.app.smallcoffee",
"alias":"Small Coffee Purchase",
"type":"consumable",
"state":"approved",
"title":"Kleiner Kaffee",
"description":"Spende um den Entwickler wach zu halten",
"priceMicros":1090000,
"price":"1,09 €",
"currency":"EUR",
"countryCode":"DE",
"loaded":true,
"canPurchase":false,
"owned":false,
"downloading":false,
"downloaded":false,
"additionalData":null,
"transaction":{
  "type":"ios-appstore",
  "id":"1000000462782073",
  "appStoreReceipt":"MIIT3QY/...l9TpzS2jfUyw==",
  "transactionReceipt":"iuuHIUHIUNUIUiuuniuhu...jJKHJBJKJBKfgCn0="
},
"valid":true,
"transactions":["1000000462782073"]
}
```
