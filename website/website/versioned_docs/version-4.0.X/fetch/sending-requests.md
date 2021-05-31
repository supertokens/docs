---
id: version-4.0.X-sending-requests
title: Sending Requests
hide_title: true
original_id: sending-requests
---

# Sending Requests with Fetch

## With Interceptors

You can use ```fetch``` as you regularly do using this method

<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website';

const SESSION_EXPIRED_STATUS_CODE = 440;

// call this when your app starts
SuperTokensRequest.init("/refresh", SESSION_EXPIRED_STATUS_CODE, true);

async function doAPICalls() {
    try {
        // make API call as usual
        let fetchConfig = { ... };
        let response = await fetch("/someAPI", fetchConfig);

        // handle response
        if (response.status !== 200) {
            throw response;
        }
        let data = await response.json();
        let someField = data.someField;
        // ...
    } catch (err) {
        if (err.status === SESSION_EXPIRED_STATUS_CODE) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--Via script tag-->
```js
const SESSION_EXPIRED_STATUS_CODE = 440;

supertokens.fetch.init("/refresh", SESSION_EXPIRED_STATUS_CODE, true);

async function doAPICalls() {
    try {
        // make API call as usual
        let fetchConfig = { ... };
        let response = await fetch("/someAPI", fetchConfig);

        // handle response
        if (response.status !== 200) {
            throw response;
        }
        let data = await response.json();
        let someField = data.someField;
        // ...
    } catch (err) {
        if (err.status === SESSION_EXPIRED_STATUS_CODE) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

> If your API domain is different than your website domain, then be sure to add ` credentials: 'include'` in the `fetchConfig`

## Without Interceptors
If the ```viaInterceptor``` option is ```false``` you need to replace all your ```fetch``` calls as shown below.

### The fetch function: [API Reference](../api-reference/fetch#fetchurl-config)
<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```js
SuperTokensRequest.fetch("/someAPI", config);
```
<!--Via script tag-->
```js
supertokens.fetch.fetch("/someAPI", config);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Used to send a request to your API endpoint
- Treat it like a regular ```fetch``` call
- There are other functions to specifically call ```get```, ```post```, ```delete``` and ```put``` methods. They can be seen in the [API reference](../api-reference/fetch#geturl-config-posturl-config-deleteurl-config-puturl-config) page.


<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website';

const SESSION_EXPIRED_STATUS_CODE = 440;
SuperTokensRequest.init("/refreshTokenURL", SESSION_EXPIRED_STATUS_CODE, false);

async function doAPICalls() {
    try {
        // make API call as usual
        let fetchConfig = { ... };
        let response = await SuperTokensRequest.fetch("/someAPI", fetchConfig);

        // handle response
        if (response.status !== 200) {
            throw response;
        }
        let data = await response.json();
        let someField = data.someField;
        // ...
    } catch (err) {
        if (err.status === SESSION_EXPIRED_STATUS_CODE) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--Via script tag-->
```js
const SESSION_EXPIRED_STATUS_CODE = 440;
supertokens.fetch.init("/refreshTokenURL", SESSION_EXPIRED_STATUS_CODE, false);

async function doAPICalls() {
    try {
        // make API call as usual
        let fetchConfig = { ... };
        let response = await supertokens.fetch.fetch("/someAPI", fetchConfig);

        // handle response
        if (response.status !== 200) {
            throw response;
        }
        let data = await response.json();
        let someField = data.someField;
        // ...
    } catch (err) {
        if (err.status === SESSION_EXPIRED_STATUS_CODE) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

> If your API domain is different than your website domain, then be sure to add ` credentials: 'include'` in the `fetchConfig`