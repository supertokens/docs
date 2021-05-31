---
id: version-2.0.X-custom_error_handling
title: Custom Error Handling
hide_title: true
original_id: custom_error_handling
---

# Custom Error Handling

There are three types of errors:
- **Unauthorised**: This is when the user has been logged out, or session has expired.
- **Try Refresh Token**: This is when the access token has expired, and you need to refresh the session.
- **Token theft detected**: This is thrown in case a user is being attacked. You can us this to revoke their affected session.

## Define error handlers using the `supertokens.errorHandler()` middleware
```js
app.use(supertokens.errorHandler({
    onUnauthorised?: (err, req, res, next) => void,
    onTryRefreshToken?: (err, req, res, next) => void,
    onTokenTheftDetected?: (sessionHandle, userId, req, res, next) => void
}));
```
- All auth cookies are cleared when `onUnauthorised` and `onTokenTheftDetected` is called.
- You should respond with the same session expired HTTP status code for `onUnauthorised` and `onTryRefreshToken`. By default, this value is `440`.
- `sessionHandle` is like a session identifier (unique per session). Using this, you can revoke this session. Learn more about this [here](./session-handle).
- By default, `onTokenTheftDetected` revokes the affected session and returns the session expired status code.
- **You do not need to provide all the callbacks.**

<div class="divider"></div> 

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let supertokens = require("supertokens-node");

let app = express();

// add all your routes here...

// add SuperTokens error middleware
app.use(supertokens.errorHandler({
    onUnauthorised: (err, req, res, next) => {
        logging.logError(err);  // some logging module
        res.status(440).send("Please login again");
    },
    onTryRefreshToken: (err, req, res, next) => {
        res.status(440).send("Call the refresh API");
    },
    onTokenTheftDetected: async (sessionHandle, userId, req, res, next) => {
        res.status(440).send("You are being attacked");
        await supertokens.revokeSession(sessionHandle);       
    }
}));

// add your error middleware
app.use((err, req, res, next) => {
    res.send(500).send(err);
})
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

let app = express();

// add all your routes here...

// add SuperTokens error middleware
app.use(supertokens.errorHandler({
    onUnauthorised: (err, req, res, next) => {
        logging.logError(err);  // some logging module
        res.status(440).send("Please login again");
    },
    onTryRefreshToken: (err, req, res, next) => {
        res.status(440).send("Call the refresh API");
    },
    onTokenTheftDetected: async (sessionHandle, userId, req, res, next) => {
        res.status(440).send("You are being attacked");
        await supertokens.revokeSession(sessionHandle);       
    }
}));

// add your error middleware
app.use((err, req, res, next) => {
    res.send(500).send(err);
})
```
<!--END_DOCUSAURUS_CODE_TABS-->

