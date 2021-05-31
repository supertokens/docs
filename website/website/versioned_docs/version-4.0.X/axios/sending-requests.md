---
id: version-4.0.X-sending-requests
title: Sending Requests
hide_title: true
original_id: sending-requests
---

# Sending Requests with Axios

## With Interceptors

You can use ```axios``` as you regularly do using this method.

### The ```makeSuper``` function: [API Reference](../api-reference/axios#makesuperaxios)
<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```js
SuperTokensRequest.makeSuper(axios);
```
<!--Via script tag-->
```js
supertokens.axios.makeSuper(axios);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Adds interceptors to the given ```axios``` instance.
- To be called at least once on an axios instance before using it. 

#### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website/axios';
import axios from "axios";
SuperTokensRequest.makeSuper(axios);

SuperTokensRequest.init("/refresh", 440);

async function doAPICalls() {
    try {
        let postData = { ... };
        let response = await axios({url: "someAPI", method: "post", data: postData });
        let data = await response.data;
        let someField = data.someField;
    } catch (err) {
        if (err.response !== undefined && err.response.status === SESSION_EXPIRED_STATUS_CODE) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--Via script tag-->
```js
supertokens.axios.makeSuper(axios);
supertokens.axios.init("/refresh", 440, true);

async function doAPICalls() {
    try {
        let postData = { ... };
        let response = await axios({url: "someAPI", method: "post", data: postData });
        let data = await response.data;
        let someField = data.someField;
    } catch (err) {
        if (err.response !== undefined && err.response.status === SESSION_EXPIRED_STATUS_CODE) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

> If your API domain is different than your website domain, then be sure to add `withCredentials: true` in the axios config call.

## Without Interceptors
You need to replace all your ```axios``` calls as shown below.

### The axios function: [API Reference](../api-reference/axios#axiosdata-config)
<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```js
SuperTokensRequest.axios("/someAPI", config);
```
<!--Via script tag-->
```js
supertokens.axios.axios("/someAPI", config);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Used to send a request to your API endpoint
- Treat it like a regular ```axios``` call
- There are other functions to specifically call ```get```, ```post```, ```delete``` and ```put``` methods. They can be seen in the [API reference](../api-reference/axios#getdata-config-postdata-config-deletedata-config-putdata-config) page.


<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website/axios';

SuperTokensRequest.init("/refreshTokenURL", 440, false);

async function doAPICalls() {
    try {
        let postData = { ... };
        let response = await SuperTokensRequest.axios({url: "someAPI", method: "post", data: postData });
        let data = await response.data;
        let someField = data.someField;
    } catch (err) {
        if (err.response !== undefined && err.response.status === SESSION_EXPIRED_STATUS_CODE) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--Via script tag-->
```js
supertokens.axios.init("/refreshTokenURL", 440, false);

async function doAPICalls() {
    try {
        let postData = { ... };
        let response = await SuperTokensRequest.axios({url: "someAPI", method: "post", data: postData });
        let data = await response.data;
        let someField = data.someField;
    } catch (err) {
        if (err.response !== undefined && err.response.status === SESSION_EXPIRED_STATUS_CODE) {
            // redirect user to login
        } else {
            // handle error
        }
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

> If your API domain is different than your website domain, then be sure to add `withCredentials: true` in the axios config call.