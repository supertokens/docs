---
id: version-1.0.X-user-login
title: User Login
hide_title: true
original_id: user-login
---

# User Login

To login a user, you must first authenticate their credentials and then create a session for them so that they can access your APIs.

### Call the `createNewSession` function: [API Reference](../api-reference/create-new-session)
```js
supertokens.createNewSession(userId, jwtPayload, sessionData);
```
- `userId` must be of type `string`
- `jwtPayload` should not contain any sensitive information.
- This function will return the following tokens:
    - `antiCsrfToken` (set in response header)
        - **Key:** anti-csrf
        - **Value:** antiCsrfToken
        - Also add the following header to your response: ```Access-Control-Expose-Headers: "anti-csrf"```
        - Will be `undefined` if `enable_anti_csrf` in the SuperTokens config.yaml is set to ```false```.
    - `idRefreshToken` (set in response header)
        - **Key:** id-refresh-token
        - **Value:** idRefreshToken.token
        - Also add the following header to your response: ```Access-Control-Expose-Headers: "id-refresh-token"```
    - `accessToken` (Set in cookie)
        - **Key:** sAccessToken
        - **Value:** accessToken.token
        - **HttpOnly:** true
        - **Secure:** accessToken.cookieSecure
        - **Expiry time:** new Date(accessToken.expiry)
        - **Path:** accessToken.cookiePath
        - **Domain:** accessToken.domain
    - `refreshToken` (Set in cookie)
        - **Key:** sRefreshToken
        - **Value:** refreshToken.token
        - **HttpOnly:** true
        - **Secure:** refreshToken.cookieSecure
        - **Expiry time:** new Date(refreshToken.expiry)
        - **Path:** refreshToken.cookiePath
        - **Domain:** refreshToken.domain
    - `idRefreshToken` (Set in cookie)
        - **Key:** sIdRefreshToken
        - **Value:** idRefreshToken.token
        - **HttpOnly:** true
        - **Secure:** accessToken.cookieSecure
        - **Expiry time:** new Date(idRefreshToken.expiry)
        - **Path:** accessToken.cookiePath
        - **Domain:** accessToken.domain

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node/session");

function loginAPI() {
    // check for user credentials..
    let userId = "User1";
    let jwtPayload = {name: "spooky action at a distance"};
    let sessionData = {awesomeThings: ["programming", "javascript", "supertokens"]};
    
    // NOTE: you can also use async/await here
    supertokens.createNewSession(userId, jwtPayload, sessionData).then(session => {

        let accessToken = session.accessToken;
        setCookie("sAccessToken", accessToken.token, accessToken.domain, accessToken.cookieSecure, true, new Date(accessToken.expiry), accessToken.path);
        
        let refreshToken = session.refreshToken;
        setCookie("sRefreshToken", refreshToken.token, refreshToken.domain, refreshToken.cookieSecure, true, new Date(refreshToken.expiry), refreshToken.path);
        
        let idRefreshToken = session.idRefreshToken;
        setCookie("sIdRefreshToken", idRefreshToken.token, accessToken.domain, accessToken.cookieSecure, true, new Date(idRefreshToken.expiry), accessToken.path);

        setHeader("anti-csrf", session.antiCsrfToken);
        setHeader("id-refresh-token", idRefreshToken.token);

        // reply with success

    }).catch(err => {
        // session was not created. Handle error...
    });
}

function setCookie(key, value, domain, secure, httpOnly, expires, path) {
    // this will be specific to your framework...
}

function setHeader(key, value) {
    // this will be specific to your framework...
}
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node/session';

function loginAPI() {
    // check for user credentials..
    let userId = "User1";
    let jwtPayload = {name: "spooky action at a distance"};
    let sessionData = {awesomeThings: ["programming", "javascript", "supertokens"]};

    // NOTE: you can also use async/await here
    supertokens.createNewSession(userId, jwtPayload, sessionData).then(session: SuperTokenSession => {

        let accessToken = session.accessToken;
        setCookie("sAccessToken", accessToken.token, accessToken.domain, accessToken.cookieSecure, true, new Date(accessToken.expiry), accessToken.path);
        
        let refreshToken = session.refreshToken;
        setCookie("sRefreshToken", refreshToken.token, refreshToken.domain, refreshToken.cookieSecure, true, new Date(refreshToken.expiry), refreshToken.path);
        
        let idRefreshToken = session.idRefreshToken;
        setCookie("sIdRefreshToken", idRefreshToken.token, accessToken.domain, accessToken.cookieSecure, true, new Date(idRefreshToken.expiry), accessToken.path);

        setHeader("anti-csrf", session.antiCsrfToken);
        setHeader("id-refresh-token", idRefreshToken.token);

        // reply with success

    }).catch(err => {
        // session was not created. Handle error...
    });
}

function setCookie(key: string, value: string, domain: string, secure: boolean, httpOnly: boolean, expires: Date, path: string) {
    // this will be specific to your framework...
}

function setHeader(key: string, value: string) {
    // this will be specific to your framework...
}
```
<!--END_DOCUSAURUS_CODE_TABS-->