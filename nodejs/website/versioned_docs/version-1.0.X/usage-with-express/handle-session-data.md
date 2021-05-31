---
id: version-1.0.X-handle-session-data
title: Handle Session Data
hide_title: true
original_id: handle-session-data
---

# Handling Session Data

### There are two types of data you can store in a session:
- `jwtPayload`
    - Once set, it cannot be changed further.
    - Should not contain any sensitive information since this is sent over to the client.
    - Once you have a Session object, fetching the jwtPayload does not require any database calls.
- `sessionData`
    - This can be changed anytime during the lifetime of a session.
    - Can contain sensitive information since this is only stored in your database.
    - Requires a database call to read or write this information.
    - Fetching or modification of this is not synchronized per session.

### If you have a session object
Please see the [Session Object](../api-reference/session-object/overview) section for more information

### If you do not have a session object
<div class="specialNote" style="margin-bottom: 20px">
These functions should only be used if absolutely necessary, since they do not handle cookies for you. So if you are able to get a Session object AND have not already sent a reply to the client, please use the functions from the above section instead.
</div>

#### Call the `getSessionData` function: [API Reference](../api-reference/get-session-data)
```js
supertokens.getSessionData(sessionHandle);
```
- This function requires a database call each time it's called.

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
const supertokens = require("supertokens-node");

async function changeSessionDataAPI(req, res) {
    // first we get the session object
    let session;
    try {
        session = await supertokens.getSession(req, res, true);
    } catch (err) {
        //...
        return;
    }
    try {
        let jwtPayload = session.getJWTPayload();
        let sessionData = await session.getSessionData();
        await session.updateSessionData({comment: "new session data"});
        res.send("Success!");
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                res.status(500).send("Something went wrong");
            } else { // UNAUTHORISED
                res.status(440).send("Session expired!");
            }
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
    }
}

async function changeSessionDataWithSessionObject(sessionHandle) {
    try {
        let sessionData = await supertokens.getSessionData(sessionHandle);
        await supertokens.updateSessionData(sessionHandle, {comment: "new session data"});
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                console.log("Something went wrong. Error from supertokens lib");
            } else { // UNAUTHORISED
                console.log("Session expired.");
            }
        } else {
            console.log("Something went wrong - error from somewhere else.");
        }
    }
}
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";
import { Request, Response } from "express";

async function changeSessionDataAPI(req: Request, res: Response) {
    // first we get the session object
    let session: supertokens.Session;
    try {
        session = await supertokens.getSession(req, res, true);
    } catch (err) {
        //...
        return;
    }
    try {
        let jwtPayload = session.getJWTPayload();
        let sessionData = await session.getSessionData();
        await session.updateSessionData({comment: "new session data"});
        res.send("Success!");
    } catch (err: any) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                res.status(500).send("Something went wrong");
            } else { // UNAUTHORISED
                res.status(440).send("Session expired!");
            }
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
    }
}

async function changeSessionDataWithSessionObject(sessionHandle: string) {
    try {
        let sessionData = await supertokens.getSessionData(sessionHandle);
        await supertokens.updateSessionData(sessionHandle, {comment: "new session data"});
    } catch (err: any) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                console.log("Something went wrong. Error from supertokens lib");
            } else { // UNAUTHORISED
                console.log("Session expired.");
            }
        } else {
            console.log("Something went wrong - error from somewhere else.");
        }
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->