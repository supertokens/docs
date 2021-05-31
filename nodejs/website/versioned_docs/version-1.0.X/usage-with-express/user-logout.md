---
id: version-1.0.X-user-logout
title: User Logout
hide_title: true
original_id: user-logout
---

# User Logout
- Logging out a user from a particular device can be done via revoking that user session - either via a [`Session object`](../api-reference/session-object/overview), or via a [`sessionHandle`](../api-reference/session-handle).
- If you want to revoke all sessions belonging to a user, you will only need their userId.

### If you do not have a session object
<div class="specialNote" style="margin-bottom: 20px">
If you can get the Session object, use that since revoking a session using that will also take care of clearing the cookies for you.
</div>

### If you have a session object
Please see the [Session Object](../api-reference/session-object/overview) section for more information

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
const supertokens = require("supertokens-node");

// example using Session object
app.use("/logout", function (req, res) {
    // first we verify the session.
    let session;
    try {
        session = await supertokens.getSession(req, res, true);
    } catch (err) {
        // See verify session page to handle errors here.
    }
    try {
        await session.revokeSession();
        res.send("Success! Go to login page");
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) { // GENERAL_ERROR
            res.status(500).send("Something went wrong");
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
    }
});

//----------------------------------------

// example using sessionHandle
async function logoutUsingSessionHandle(sessionHandle) {
    try {
        let success = await supertokens.revokeSessionUsingSessionHandle(sessionHandle);
        if (success) {
            // your code here..
        } else {
            // either sessionHandle is invalid, or session was already removed.
            // your code here..
        }
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) { // GENERAL_ERROR
            console.log("Something went wrong from supertokens lib");
        } else {
            console.log("Something went wrong");
        }
    }
}

//----------------------------------------

// example using userId
async function logoutAllSessionForUser(userId) {
    try {
        await supertokens.revokeAllSessionsForUser(userId);
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) { // GENERAL_ERROR
            console.log("Something went wrong from supertokens lib");
        } else {
            console.log("Something went wrong");
        }
    }
}
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";
import { Request, Response } from "express";

// example using Session object
app.use("/logout", function (req: Request, res: Response) {
    // first we verify the session.
    let session;
    try {
        session = await supertokens.getSession(req, res, true);
    } catch (err) {
        // See verify session page to handle errors here.
    }
    try {
        await session.revokeSession();
        res.send("Success! Go to login page");
    } catch (err: any) {
        if (supertokens.Error.isErrorFromAuth(err)) { // GENERAL_ERROR
            res.status(500).send("Something went wrong");
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
    }
});

//----------------------------------------

// example using sessionHandle
async function logoutUsingSessionHandle(sessionHandle: string) {
    try {
        let success = await supertokens.revokeSessionUsingSessionHandle(sessionHandle);
        if (success) {
            // your code here..
        } else {
            // either sessionHandle is invalid, or session was already removed.
            // your code here..
        }
    } catch (err: any) {
        if (supertokens.Error.isErrorFromAuth(err)) { // GENERAL_ERROR
            console.log("Something went wrong from supertokens lib");
        } else {
            console.log("Something went wrong");
        }
    }
}

//----------------------------------------

// example using userId
async function logoutAllSessionForUser(userId: string) {
    try {
        await supertokens.revokeAllSessionsForUser(userId);
    } catch (err: any) {
        if (supertokens.Error.isErrorFromAuth(err)) { // GENERAL_ERROR
            console.log("Something went wrong from supertokens lib");
        } else {
            console.log("Something went wrong");
        }
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->