---
id: version-2.4.X-user-login
title: User Login
hide_title: true
original_id: user-login
---

# User Login

### Call the `createNewSession` function: [API Reference](../api-reference/create-new-session)
```js
supertokens.createNewSession(res, userId, jwtPayload, sessionData);
```
- `jwtPayload` (type `object`) should not contain any sensitive information. This will also be accessible from the frontend.
- `sessionData` (type `object`) is stored in your database and can contain any information.
- This will attach all relevant cookies and header to the `res` object.

<div class="divider"></div> 

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

app.post("/login", async function (req, res) {
    // check for user credentials..

    let userId = "User1";
    let jwtPayload = {name: "spooky action at a distance"};
    let sessionData = {awesomeThings: ["programming", "javascript", "supertokens"]};

    await supertokens.createNewSession(res, userId, jwtPayload, sessionData);
    
    res.send("logged in");
});
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node';

app.post("/login", async function (req, res) {
    // check for user credentials..

    let userId = "User1";
    let jwtPayload = {name: "spooky action at a distance"};
    let sessionData = {awesomeThings: ["programming", "javascript", "supertokens"]};

    await supertokens.createNewSession(res, userId, jwtPayload, sessionData);

    res.send("logged in");
});
```
<!--END_DOCUSAURUS_CODE_TABS-->