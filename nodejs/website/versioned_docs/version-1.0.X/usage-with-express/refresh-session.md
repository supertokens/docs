---
id: version-1.0.X-refresh-session
title: Refresh Session
hide_title: true
original_id: refresh-session
---

# Refresh Session
This operation is to be done whenever any function returns the TRY_REFRESH_TOKEN error.

### The following are the steps that describe how this works:

- Your frontend calls an API (let's say `/getHomeFeed`) with an access token that has expired.
- In that API, your backend calls the `supertokens.getSession(req, res, enableCsrfProtection)` function which throws a `TRY_REFRESH_TOKEN` error.
- Your backend replies with a session expired status code to your frontend.
- Your frontend detects this status code and calls an API on your backend that will refresh the session (let's call this API `/api/refresh`). Our frontend SDK does this automatically.
- In this API, you call the `supertokens.refreshSession(req, res)` function that "refreshes" the session. This will result in the generation of a new access and a new refresh token. The lifetime of these new tokens starts from the point when they were generated.
- Your frontend then calls the `/getHomeFeed` API once again with the new access token yielding a successful response.

### Call the `refreshSession` function: [API Reference](../api-reference/refresh-session)
```js
supertokens.refreshSession(req, res)
```

- Refreshes the session by generating new access and new refresh tokens.
- If token theft is detected, then it throws a special `TOKEN_THEFT_DETECTED` error. Using this error object, you can see who the affected user is and can choose to revoke their affected session.
- This function should only be called in a special POST API endpoint whose only job is to refresh the session. The path to this API will have to be given in the SuperTokens config.yaml so that the refresh token cookie path can be set correctly.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

app.post("/api/refresh", function (req, res) {
    // NOTE: you can also use async/await here
    supertokens.refreshSession(req, res).then(session => {
        // on success
        res.send("Successful refreshing of session!");
    }).catch(err => {
        // on error
        if (supertokens.Error.isErrorFromAuth(err)) {   // we check that this error is indeed from our lib or not. Just to be safe.
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                res.status(500).send("Something went wrong");
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                res.status(440).send("Session expired. Please login again!");
            } else {    // TOKEN_THEFT_DETECTED
                // we have detected token theft! 
                // redirect user to login page
                res.status(440).send("Session expired. Please login again!");

                // get the affected user details
                let userId = err.err.userId;
                let sessionHandle = err.err.sessionHandle;
                // we can now revoke this session or all sessions belonging to this user.
                // we can also alert this user if needed.
            }
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
    });
});
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";
import { Request, Response } from "express";

app.post("/api/refresh", function (req: Request, res: Response) {
    // NOTE: you can also use async/await here
    supertokens.refreshSession(req, res).then(session: supertokens.Session => {
        // on success
        res.send("Successful refreshing of session!");
    }).catch(err: any => {
        // on error
        if (supertokens.Error.isErrorFromAuth(err)) {   // we check that this error is indeed from our lib or not. Just to be safe.
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                res.status(500).send("Something went wrong");
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                res.status(440).send("Session expired. Please login again!");
            } else {    // TOKEN_THEFT_DETECTED
                // we have detected token theft! 
                // redirect user to login page
                res.status(440).send("Session expired. Please login again!");

                // get the affected user details
                let userId = err.err.userId;
                let sessionHandle = err.err.sessionHandle;
                // we can now revoke this session or all sessions belonging to this user.
                // we can also alert this user if needed.
            }
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
    });
});
```
<!--END_DOCUSAURUS_CODE_TABS-->