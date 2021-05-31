---
id: init
title: Init
hide_title: true
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
            (...)
        })
    ]
});
```


## Config values

- ```sessionScope``` (Optional)
    - Type: ```string```
    - Default: Same as the domain in the currently loaded URL.
    - Set this to your website domain across which you want to share a session. For example, if your website domain (that is loaded by the user) is ```example.com```, then the value of this should be ```example.com```. If your site has subdomains that need to keep the same session, like ```a.example.com``` and ```b.example.com```, then the value of this should be ```example.com```.
- ```sessionExpiredStatusCode``` (Optional)
    - Type: ```number```
    - Default: ```401```
    - HTTP status code that indicates session expiry - as sent by your APIs.
- ```refreshAPICustomHeaders``` (Optional)
    - Type: ```object```
    - Default: ```{}```
    - If your refresh API requires any custom headers (for example a version number), then you can provide that in this object. An example is: ```{api-version: "0"}```
- ```signoutAPICustomHeaders``` (Optional)
    - Type: ```object```
    - Default: ```{}```
    - If your sign-out API requires any custom headers (for example a version number), then you can provide that in this object. An example is: ```{api-version: "0"}```
- ```autoAddCredentials``` (Optional)
    - Type: ```boolean```
    - Default: ```true```
    - Setting this to true adds `credentials: "include"` to all requests. This is needed for cross origin requests (website is on `example.com` and API is on `api.example.com`)
- ```isInIframe``` (Optional)
    - Type: ```boolean```
    - Default: ```false```
    - Set this to `true` if your frontend can be used in an iframe. Remember that this means you will have to use `https` for your website domain while in development.
