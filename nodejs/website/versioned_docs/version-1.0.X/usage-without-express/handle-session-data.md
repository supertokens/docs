---
id: version-1.0.X-handle-session-data
title: Handle Session Data
hide_title: true
original_id: handle-session-data
---

# Handling Session Data

### There are two types of data you can store in a session:
- **jwtPayload**
    - Once set, it cannot be changed further.
    - Should not contain any sensitive information since this is sent over to the client.
    - This is returned on a successful response of the `getSession` function call.
- **sessionData**
    - This can be changed anytime during the lifetime of a session.
    - Can contain sensitive information since this is only stored in your database.
    - Requires a database call to read or write this information.
    - Fetching or modification of this is not synchronized per session.

#### Call the `getSessionData` function: [API Reference](../api-reference/get-session-data)
```js
supertokens.getSessionData(sessionHandle);
```
#### Call the `updateSessionData` function: [API Reference](../api-reference/update-session-data)
```js
supertokens.updateSessionData(sessionHandle, newSessionData);
```
- This function overrides the current session data stored for this sessionHandle.
- This function requires a database call each time it's called.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node/session");

async function changeSessionDataAPI() {
    let session;
    try {
        let accessToken = //...
        let antiCsrfToken = //...
        let response = await supertokens.getSession(accessToken, antiCsrfToken);
        // .. check if received a new access token and handle that.
        session = response.session;
    } catch (err) {
        //...
    }
    try {

        // get JWT payload
        let jwtPayload = session.jwtPayload;

        // get session data from database
        let sessionData = await supertokens.getSessionData(session.handle);

        // overwrite current session data.
        await supertokens.updateSessionData(session.handle, {comment: "new session data"});
        // success!
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                // send 500 status code
            } else { // UNAUTHORISED
                clearAuthCookies();
                // redirect to user login.
            }
        } else {
            // send 500 status code
        }
    }
}

function clearAuthCookies() {
    // clear sAccessToken, sRefreshToken, sIdRefreshToken
}
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node/session";

async function changeSessionDataAPI() {
    let session;
    try {
        let accessToken = //...
        let antiCsrfToken = //...
        let response = await supertokens.getSession(accessToken, antiCsrfToken);
        // .. check if received a new access token and handle that.
        session = response.session;
    } catch (err) {
        //...
    }
    try {

        // get JWT payload
        let jwtPayload = session.jwtPayload;

        // get session data from database
        let sessionData = await supertokens.getSessionData(session.handle);

        // overwrite current session data.
        await supertokens.updateSessionData(session.handle, {comment: "new session data"});
        // success!
    } catch (err: any) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                // send 500 status code
            } else { // UNAUTHORISED
                clearAuthCookies();
                // redirect to user login.
            }
        } else {
            // send 500 status code
        }
    }
}

function clearAuthCookies() {
    // clear sAccessToken, sRefreshToken, sIdRefreshToken
}
```
<!--END_DOCUSAURUS_CODE_TABS-->