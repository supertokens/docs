---
id: version-1.0.X-refresh-session
title: Refresh Session
hide_title: true
original_id: refresh-session
---

# Refresh Session
This operation is to be done whenever any function returns the TRY_REFRESH_TOKEN error.

### The following are the steps that describe how this works:

- Your frontend calls an API (let's say `/getHomeFeed`) with an access token that has expired.
- In that API, your backend calls the `supertokens.getSession(req, res, enableCsrfProtection)` function which throws a `TRY_REFRESH_TOKEN` error.
- Your backend replies with a session expired status code to your frontend.
- Your frontend detects this status code and calls an API on your backend that will refresh the session (let's call this API `/api/refresh`). Our frontend SDK does this automatically.
- In this API, you call the `supertokens.refreshSession(req, res)` function that "refreshes" the session. This will result in the generation of a new access and a new refresh token. The lifetime of these new tokens starts from the point when they were generated.
- Your frontend then calls the `/getHomeFeed` API once again with the new access token yielding a successful response.


### Call the `refreshSession` function: [API Reference](../api-reference/refresh-session)
```js
supertokens.refreshSession(refreshToken)
```

- Refreshes the session by generating new access and new refresh tokens.
- If token theft is detected, then it throws a special `TOKEN_THEFT_DETECTED` error. Using this error object, you can see who the affected user is and can choose to revoke their affected session.
- This function should only be called in a special POST API endpoint whose only job is to refresh the session. The path to this API will have to be given in the SuperTokens config.yaml so that the refresh token cookie path can be set correctly.
- This function will return a new set of auth and anti-csrf tokens. Please see the [User login](./user-login) section or the example code below to see how to handle these tokens.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node/session");

// Should be a POST API
function refreshSessionAPI() {
    let refreshToken = getCookieValue("sRefreshToken");
    if (refreshToken === undefined) {
        clearAuthCookies();
        // redirect user to login page 
        return;
    }
    // NOTE: you can also use async/await here
    supertokens.refreshSession(refreshToken).then(session => {

        let accessToken = session.accessToken;
        setCookie("sAccessToken", accessToken.value, accessToken.domain, accessToken.cookieSecure, true, new Date(accessToken.expiry), accessToken.path);
        
        let refreshToken = session.refreshToken;
        setCookie("sRefreshToken", refreshToken.value, refreshToken.domain, refreshToken.cookieSecure, true, new Date(refreshToken.expiry), refreshToken.path);
        
        let idRefreshToken = session.idRefreshToken;
        setCookie("sIdRefreshToken", idRefreshToken.value, accessToken.domain, false, false, new Date(idRefreshToken.expiry), accessToken.path);

        let antiCsrfToken = session.antiCsrfToken;
        setHeader("anti-csrf", antiCsrfToken);
        // reply with success.

    }).catch(err => {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                // reply with status code 500
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                clearAuthCookies();
                // redirect user to login page
            } else {    // TOKEN_THEFT_DETECTED
                // redirect user to login page
                clearAuthCookies();
                let userId = err.err.userId;
                let sessionHandle = err.err.sessionHandle;
                // we can now revoke this session or all sessions belonging to this user
                // we can also alert this user if needed...
            }
        } else {
            // reply with status code 500
        }
    });
}

function clearAuthCookies() {
    // clear sAccessToken, sRefreshToken, sIdRefreshToken
}

function getCookieValue(key) {
    // this will be specific to your framework..
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
import * as supertokens from "supertokens-node/session";

// Should be a POST API
function refreshSessionAPI() {
    let refreshToken = getCookieValue("sRefreshToken");
    if (refreshToken === undefined) {
        clearAuthCookies();
        // redirect user to login page 
        return;
    }
    // NOTE: you can also use async/await here
    supertokens.refreshSession(refreshToken).then(session => {

        let accessToken = session.accessToken;
        setCookie("sAccessToken", accessToken.value, accessToken.domain, accessToken.cookieSecure, true, new Date(accessToken.expiry), accessToken.path);
        
        let refreshToken = session.refreshToken;
        setCookie("sRefreshToken", refreshToken.value, refreshToken.domain, refreshToken.cookieSecure, true, new Date(refreshToken.expiry), refreshToken.path);
        
        let idRefreshToken = session.idRefreshToken;
        setCookie("sIdRefreshToken", idRefreshToken.value, accessToken.domain, false, false, new Date(idRefreshToken.expiry), accessToken.path);

        let antiCsrfToken = session.antiCsrfToken;
        setHeader("anti-csrf", antiCsrfToken);
        // reply with success.

    }).catch(err: any => {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                // reply with status code 500
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                clearAuthCookies();
                // redirect user to login page
            } else {    // TOKEN_THEFT_DETECTED
                // redirect user to login page
                clearAuthCookies();
                let userId = err.err.userId;
                let sessionHandle = err.err.sessionHandle;
                // we can now revoke this session or all sessions belonging to this user
                // we can also alert this user if needed...
            }
        } else {
            // reply with status code 500
        }
    });
}

function clearAuthCookies() {
    // clear sAccessToken, sRefreshToken, sIdRefreshToken
}

function setCookie(key: string, value: string, domain: string, secure: boolean, httpOnly: boolean, expires: Date, path: string) {
    // this will be specific to your framework...
}

function getCookieValue(key: string) {
    // this will be specific to your framework..
}

function setHeader(key: string, value: string) {
    // this will be specific to your framework...
}
```
<!--END_DOCUSAURUS_CODE_TABS-->