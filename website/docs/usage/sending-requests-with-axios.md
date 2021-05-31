---
id: sending-requests-with-axios
title: Sending Requests With Axios
hide_title: true
---

# Sending Requests with Axios

You can add SuperTokens interceptors to `axios` and use it like you regularly do.

### The ```addAxiosInterceptors``` function: [API Reference](../api-reference#addaxiosinterceptorsaxios)
<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```js
SuperTokensRequest.addAxiosInterceptors(axios);
```
<!--Via script tag-->
```js
supertokens.addAxiosInterceptors(axios);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Adds interceptors to the given ```axios``` instance.
- To be called at least once on an axios instance before using it. 

#### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website';
import axios from "axios";
SuperTokensRequest.addAxiosInterceptors(axios);

SuperTokensRequest.init({
    apiDomain: "https://api.example.com"
});

async function doAPICalls() {
    try {
        let postData = { ... };
        let response = await axios({url: "someAPI", method: "post", data: postData });
        let data = await response.data;
        let someField = data.someField;
    } catch (err) {
        if (err.response !== undefined && err.response.status === 401) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--Via script tag-->
```js
supertokens.addAxiosInterceptors(axios);
supertokens.init({
    apiDomain: "https://api.example.com"
});

async function doAPICalls() {
    try {
        let postData = { ... };
        let response = await axios({url: "someAPI", method: "post", data: postData });
        let data = await response.data;
        let someField = data.someField;
    } catch (err) {
        if (err.response !== undefined && err.response.status === 401) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->