---
id: version-1.0.X-sending-requests
title: Sending Requests
hide_title: true
original_id: sending-requests
---

# Sending Requests with Axios

## With Interceptors

You can use ```axios``` as you regularly do using this method.

### The ```makeSuper``` function: [API Reference](../api-reference/axios#makesuperaxios)
```js
SuperTokensRequest.makeSuper(axios);
```

- Adds interceptors to the given ```axios``` instance.
- To be called at least once on an axios instance before using it. 

#### Example
```ts
import SuperTokensRequest from 'supertokens-react-native/axios';
import axios from "axios";
SuperTokensRequest.makeSuper(axios);

SuperTokensRequest.init("/refresh", 440);

async function doAPICalls() {
    try {
        let postData = { ... };
        let response = await axios({
            url: "someAPI", 
            method: "post", 
            data: postData,
            withCredentials: true 
        });
        let data = await response.data;
        let someField = data.someField;
    } catch (err) {
        if (err.response !== undefined && err.response.status === SESSION_EXPIRED_STATUS_CODE) {
            // show login screen
        } else {
            // handle error
        }
    }
}
```

> Be sure to add `withCredentials: true` in the axios config call.

## Without Interceptors
You need to replace all your ```axios``` calls as shown below.

### The axios function: [API Reference](../api-reference/axios#axiosdata-config)
```js
SuperTokensRequest.axios("/someAPI", config);
```

- Used to send a request to your API endpoint
- Treat it like a regular ```axios``` call
- There are other functions to specifically call ```get```, ```post```, ```delete``` and ```put``` methods. They can be seen in the [API reference](../api-reference/axios#getdata-config-postdata-config-deletedata-config-putdata-config) page.


```ts
import SuperTokensRequest from 'supertokens-react-native/axios';

SuperTokensRequest.init("/refreshTokenURL", 440, false);

async function doAPICalls() {
    try {
        let postData = { ... };
        let response = await SuperTokensRequest.axios({
            url: "someAPI",
            method: "post",
            data: postData,
            withCredentials: true 
        });
        let data = await response.data;
        let someField = data.someField;
    } catch (err) {
        if (err.response !== undefined && err.response.status === SESSION_EXPIRED_STATUS_CODE) {
            // show login screen
        } else {
            // handle error
        }
    }
}
```

> Be sure to add `withCredentials: true` in the axios config call.