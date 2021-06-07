---
id: version-0.1.X-init
title: Init
hide_title: true
original_id: init
---

# Session `init`

To start using the "Session" recipe for session management, start by importing the `Session` module from the library and add it to the `recipeList`:

```js
import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    appInfo: {...},
__HIGHLIGHT__    recipeList: [
        Session.init()
    ] __END_HIGHLIGHT__
});
```


## Using Axios

You will need to enable `axios` interceptors if you are using `axios` to communicate with your API.

```js
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
__HIGHLIGHT__ import Session, {addAxiosInterceptors} from "supertokens-auth-react/recipe/session";
import axios from "axios";
addAxiosInterceptors(axios); __END_HIGHLIGHT__

SuperTokens.init({
    appInfo: {...},
    recipeList: [
        Session.init()
    ]
});

```

## Session configuration

You can customize the `Session` module while initializing SuperTokens:


```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        Session.init({
            refreshTokenUrl: "CUSTOM_REFRESH_TOKEN_URL",
            (...)
        })
    ]
});
```


## Config values

- ```refreshTokenUrl```
    - Type: ```string```
    - Should be the full request URL for your refresh session API endpoint.
    - This function will send a ```POST``` request to it.
- ```sessionExpiredStatusCode``` (Optional)
    - Type: ```number```
    - Default: ```401```
    - HTTP status code that indicates session expiry - as sent by your APIs.
- ```refreshAPICustomHeaders``` (Optional)
    - Type: ```object```
    - Default: ```{}```
    - If your refresh API requires any custom headers (for example a version number), then you can provide that in this object. An example is: ```{api-version: "0"}```
- ```autoAddCredentials``` (Optional)
    - Type: ```boolean```
    - Default ```true```
    - Setting this to true adds `credentials: "include"` to all requests. This is needed for cross origin requests (website is on `example.com` and API is on `api.example.com`)
