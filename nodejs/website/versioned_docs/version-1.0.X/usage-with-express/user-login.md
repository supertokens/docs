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
supertokens.createNewSession(res, userId, jwtPayload, sessionData);
```
- Call this function after you have verified the user credentials.
- This will override any existing session that exists in the `res` object with a new session.
- `jwtPayload` should not contain any sensitive information.

<div class="divider"></div> 

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

app.post("/login", function (req, res) {
    // check for user credentials..
    let userId = "User1";
    let jwtPayload = {name: "spooky action at a distance"};
    let sessionData = {awesomeThings: ["programming", "javascript", "supertokens"]};

    // NOTE: you can also use async/await here
    supertokens.createNewSession(res, userId, jwtPayload, sessionData).then(session => {
        res.send("Session created successfully!");
    }).catch(err => {
        // This will be of type GENERAL_ERROR (See error handling section).
        // Handle error by retrying, or sending the user a 500 status code.
    });
});
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node';
import { Request, Response } from "express";

app.post("/login", function (req: Request, res: Response) {
    // check for user credentials..
    let userId = "User1";
    let jwtPayload = {name: "spooky action at a distance"};
    let sessionData = {awesomeThings: ["programming", "javascript", "supertokens"]};

    // NOTE: you can also use async/await here
    supertokens.createNewSession(res, userId, jwtPayload, sessionData).then(session: supertokens.Session => {
        res.send("Session created successfully!");
    }).catch(err => {
        // This will be of type GENERAL_ERROR (See error handling section).
        // Handle error by retrying, or sending the user a 500 status code.
    });
});
```
<!--END_DOCUSAURUS_CODE_TABS-->