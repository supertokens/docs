---
id: version-2.0.X-session-object
title: Session Object
hide_title: true
original_id: session-object
---


# Session Object

### `getUserId` function: [API Reference](../api-reference/session-object/get-user-id)
```js
let userId = session.getUserId()
```
- This function does not do any database call.

### `getJWTPayload` function: [API Reference](../api-reference/session-object/get-jwt-payload)
```js
let jwtPayload = session.getJWTPayload()
```
- This function does not do any database call.

### `updateJWTPayload` function: [API Reference](../api-reference/session-object/update-jwt-payload)
```js
let newData = {"key": "value"};
await session.updateJWTPayload(newData)
```
- This function will change the current access token
- This function requires a database call each time it's called.

### `getSessionData` function: [API Reference](../api-reference/session-object/get-session-data)
```js
let sessionData = await session.getSessionData()
```
- This function requires a database call each time it's called.

### `updateSessionData` function: [API Reference](../api-reference/session-object/update-session-data)
```js
let newData = {"key": "value"};
await session.updateSessionData(newData)
```
- This function overwrites the current session data stored for this session.
- This function requires a database call each time it's called.

### `revokeSession` function: [API Reference](../api-reference/session-object/revoke-session)
```js
session.revokeSession()
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.


<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

app.post("/test", supertokens.middleware(), async (req, res) => {
    let session = req.session

    let userId = session.getUserId();

    // update session info
    let sessionData = await session.getSessionData();
    let newSessionData = {...sessionData, newKey: "newVal"};
    await session.updateSessionData(newSessionData);

    // update jwt payload
    let payloadData = session.getJWTPayload();
    let newPayload = {...payloadData, newKey: "newVal"};
    await session.updateJWTPayload(newPayload);

    // revoking session
    await session.revokeSession();

    res.send("");
});
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

app.post("/test", supertokens.middleware(), async (req: supertokens.Type.SessionRequest, res) => {
    let session = req.session

    let userId = session.getUserId();

    // update session info
    let sessionData = await session.getSessionData();
    let newSessionData = {...sessionData, newKey: "newVal"};
    await session.updateSessionData(newSessionData);

    // update jwt payload
    let payloadData = session.getJWTPayload();
    let newPayload = {...payloadData, newKey: "newVal"};
    await session.updateJWTPayload(newPayload);

    // revoking session
    await session.revokeSession();
    
    res.send("");
});
```
<!--END_DOCUSAURUS_CODE_TABS-->