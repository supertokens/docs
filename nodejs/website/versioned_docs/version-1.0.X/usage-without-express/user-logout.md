---
id: version-1.0.X-user-logout
title: User Logout
hide_title: true
original_id: user-logout
---

# User Logout
- Logging out a user from a particular device can be done via revoking that user session using a [`sessionHandle`](../api-reference/session-handle).
- If you want to revoke all sessions belonging to a user, you will only need their userId.

### If you have a `sessionHandle`
#### Call the `revokeSessionUsingSessionHandle` function: [API Reference](../api-reference/revoke-session-using-session-handle)
```js
supertokens.revokeSessionUsingSessionHandle(sessionHandle);
```
- Use this to logout a user from their current session
- Does not clear any cookies

### If you have a `userId`
#### Call the `revokeAllSessionsForUser` function: [API Reference](../api-reference/revoke-all-sessions-for-user)
```js
supertokens.revokeAllSessionsForUser(userId);
```
- Use this to logout a user from all their devices.
- Does not clear any cookies

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node/session");

async function logoutAPI() {
     // first we verify the session.
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
        let success = await supertokens.revokeSessionUsingSessionHandle(session.sessionHandle);
        if (success) {
            clearAuthCookies();
        } else {
            // either sessionHandle is invalid, or session was already removed.
        }
    } catch (err) {
        // something went wrong.
    }
}

// -------------------------------------------------

async function logoutAllSessionsForUser(userId) {
    try {
        await supertokens.revokeAllSessionsForUser(userId);
    } catch (err) {
        console.log("Something went wrong");
    }
}

function clearAuthCookies() {
    // clear sAccessToken, sRefreshToken, sIdRefreshToken
}
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node/session";

async function logoutAPI() {
     // first we verify the session.
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
        let success = await supertokens.revokeSessionUsingSessionHandle(session.sessionHandle);
        if (success) {
            clearAuthCookies();
        } else {
            // either sessionHandle is invalid, or session was already removed.
        }
    } catch (err) {
        // something went wrong.
    }
}

// -------------------------------------------------

async function logoutAllSessionsForUser(userId: string) {
    try {
        await supertokens.revokeAllSessionsForUser(userId);
    } catch (err) {
        console.log("Something went wrong");
    }
}

function clearAuthCookies() {
    // clear sAccessToken, sRefreshToken, sIdRefreshToken
}
```
<!--END_DOCUSAURUS_CODE_TABS-->