---
id: version-1.0.X-session-object
title: Session Object
hide_title: true
original_id: session-object
---


# Session Object

A Session object is returned when a session is verified successfully.
```js
let session = await supertokens.getSession(req, res, enableCsrfProtection);
```
> Only use this session object if you have not sent a reply to the client yet.

**Following are the functions you can use on this session object:**

### Call the `getUserId` function: [API Reference](../api-reference/session-object/get-user-id)
```js
session.getUserId()
```
- This function does not do any database call.

### Call the `getJWTPayload` function: [API Reference](../api-reference/session-object/get-jwt-payload)
```js
session.getJWTPayload()
```
- This function does not do any database call.
- It reads the payload available in the JWT access token that was used to verify this session.

### Call the `revokeSession` function: [API Reference](../api-reference/session-object/revoke-session)
```js
session.revokeSession()
```
- Use this to logout a user from their current session.
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.

### Call the `getSessionData` function: [API Reference](../api-reference/session-object/get-session-data)
```js
session.getSessionData()
```
- This function requires a database call each time it's called.

### Call the `updateSessionData` function: [API Reference](../api-reference/session-object/update-session-data)
```js
session.updateSessionData(data)
```
- This function overrides the current session data stored for this session.
- This function requires a database call each time it's called.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

async function testSessionAPI(req, res) {
    
    // first we get the session object.
    let session = await supertokens.getSession(req, res, true);
    let userId = session.getUserId();
    let getJWTPayload = session.getJWTPayload();

    // update session info example
    try {
        let sessionData = await session.getSessionData();
        let newSessionData = {...sessionData, newKey: "newVal"};
        await session.updateSessionData(newSessionData);
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                res.status(500).send("Something went wrong");
            } else {    // UNAUTHORISED
                res.status(440).send("Session expired!");
            }
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
        return;
    }

    // revoking session example
    try {
        await session.revokeSession();
        // session has been destroyed.
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) {   // GENERAL_ERROR
            res.status(500).send("Something went wrong");
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
        return;
    }
    res.send("");
}
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";
import { Request, Response } from "express";

async function testSessionAPI(req: Request, res: Response) {
    
    // first we get the session object.
    let session = await supertokens.getSession(req, res, true);
    let userId = session.getUserId();
    let getJWTPayload = session.getJWTPayload();

    // update session info example
    try {
        let sessionData = await session.getSessionData();
        let newSessionData = {...sessionData, newKey: "newVal"};
        await session.updateSessionData(newSessionData);
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                res.status(500).send("Something went wrong");
            } else {    // UNAUTHORISED
                res.status(440).send("Session expired!");
            }
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
        return;
    }

    // revoking session example
    try {
        await session.revokeSession();
        // session has been destroyed.
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) {   // GENERAL_ERROR
            res.status(500).send("Something went wrong");
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
        return;
    }
    res.send("");
}
```
<!--END_DOCUSAURUS_CODE_TABS-->