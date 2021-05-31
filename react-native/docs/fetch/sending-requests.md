---
id: sending-requests
title: Sending Requests
hide_title: true
---

# Sending Requests with Fetch

## With Interceptors

You can use ```fetch``` as you regularly do using this method

```ts
import SuperTokensRequest from 'supertokens-react-native';

const SESSION_EXPIRED_STATUS_CODE = 401;

// call this when your app starts
SuperTokensRequest.init({
    refreshTokenUrl: "/session/refresh"
});

async function doAPICalls() {
    try {
        // make API call as usual
        let fetchConfig = { 
            // ... 
            credentials: "include"
        };
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
            // show login screen
        } else {
            // handle error
        }
    }
}
```

> Be sure to add ` credentials: 'include'` in the `fetchConfig`

## Without Interceptors
If the ```viaInterceptor``` option is ```false``` you need to replace all your ```fetch``` calls as shown below.

### The fetch function: [API Reference](../api-reference/fetch#fetchurl-config)
```js
SuperTokensRequest.fetch("/someAPI", config);
```

- Used to send a request to your API endpoint
- Treat it like a regular ```fetch``` call
- There are other functions to specifically call ```get```, ```post```, ```delete``` and ```put``` methods. They can be seen in the [API reference](../api-reference/fetch#geturl-config-posturl-config-deleteurl-config-puturl-config) page.


```ts
import SuperTokensRequest from 'supertokens-react-native';

const SESSION_EXPIRED_STATUS_CODE = 401;
SuperTokensRequest.init({
    refreshTokenUrl: "/session/refresh",
    viaInterceptor: false
});

async function doAPICalls() {
    try {
        // make API call as usual
        let fetchConfig = { 
            // ... 
            credentials: "include"
        };
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
            // show login screen
        } else {
            // handle error
        }
    }
}
```

> Be sure to add ` credentials: 'include'` in the `fetchConfig`