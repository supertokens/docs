---
id: version-1.0.X-verify-session
title: Verify Session
hide_title: true
original_id: verify-session
---

# Verify Session

### Call the getSession function: [API Reference](../api-reference/get-session)
```js
supertokens.getSession(accessToken, antiCsrfToken, doAntiCsrfCheck, idRefreshToken);
```
- Use this function at the start of each API call to authenticate the user.
- `accessToken` can be obtained from the cookies with the key `sAccessToken`. If this cookie is missing, then you should treat it as an error of type `TRY_REFRESH_TOKEN`.
- `idRefreshToken` can be obtained from the cookies with the key `sIdRefreshToken`. If this cookie is missing, then you should treat it as an error of type `UNAUTHORISED`.
- `antiCsrfToken` can be obtained from the headers with the key `anti-csrf`. If this is missing and you do not want CSRF protection, pass ```doAntiCsrfCheck``` as ```false``` and ```antiCsrfToken``` as ```undefined``` to this function. Otherwise treat this like a `TRY_REFRESH_TOKEN` error.
- If this function returns an `accessToken`, update the access token cookies as mentioned in the [User login](./user-login) section.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node/session");

function likeCommentAPI() {
    // extract accessToken and antiCsrfToken
    let accessToken = getCookieValue("sAccessToken");
    let antiCsrfToken = getHeaderValue("anti-csrf");
    let idRefreshToken = getCookieValue("sIdRefreshToken");
    let doAntiCsrfCheck = true;
    if (accessToken === undefined || antiCsrfToken === undefined || idRefreshToken === undefined) {
        // access token has probably expired. Send session expired response.
        return;
    }

    // NOTE: you can also use async/await her
    supertokens.getSession(accessToken, antiCsrfToken, doAntiCsrfCheck, idRefreshToken).then(sessionResponse => {
        if (sessionResponse.accessToken !== undefined) {
            let accessToken = sessionResponse.accessToken;
            setCookie("sAccessToken", accessToken.value, accessToken.domain, accessToken.cookieSecure, true, new Date(accessToken.expiry), accessToken.path);
        }
        let userId = sessionResponse.session.userId;
        // rest of API logic...
    }).catch(err => {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                // send status code 500
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                clearAuthCookies();
                // session has expired! You can redirect the user to a login page.
            } else {    // TRY_REFRESH_TOKEN
                // send session expired response. 
            }
        } else {
            // send status code 500
        }
    });
}

function clearAuthCookies() {
    // clear sAccessToken, sRefreshToken, sIdRefreshToken
}

function setCookie(key, value, domain, secure, httpOnly, expires, path) {
    // this will be specific to your framework...
}

function getCookieValue(key) {
    // this will be specific to your framework..
}

function getHeaderValue(key) {
    // this will be specific to your framework..
}
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node/session';

function likeCommentAPI() {
    // extract accessToken and antiCsrfToken
    let accessToken = getCookieValue("sAccessToken");
    let antiCsrfToken = getHeaderValue("anti-csrf");
    let idRefreshToken = getCookieValue("sIdRefreshToken");
    let doAntiCsrfCheck = true;
    if (accessToken === undefined || antiCsrfToken === undefined || idRefreshToken === undefined) {
        // access token has probably expired. Send session expired response.
        return;
    }

    // NOTE: you can also use async/await her
    supertokens.getSession(accessToken, antiCsrfToken, doAntiCsrfCheck, idRefreshToken).then(sessionResponse => {
        if (sessionResponse.accessToken !== undefined) {
            let accessToken = sessionResponse.accessToken;
            setCookie("sAccessToken", accessToken.value, accessToken.domain, accessToken.cookieSecure, true, 
            new Date(accessToken.expiry), accessToken.path);
        }
        let userId = sessionResponse.session.userId;
        // rest of API logic...
    }).catch(err: any => {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                // send status code 500
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                clearAuthCookies();
                // session has expired! You can redirect the user to a login page.
            } else {    // TRY_REFRESH_TOKEN
                // send session expired response. 
            }
        } else {
            // send status code 500
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

function getHeaderValue(key: string) {
    // this will be specific to your framework..
}
```
<!--END_DOCUSAURUS_CODE_TABS-->