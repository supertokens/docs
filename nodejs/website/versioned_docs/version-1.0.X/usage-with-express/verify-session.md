---
id: version-1.0.X-verify-session
title: Verify Session
hide_title: true
original_id: verify-session
---

# Verify Session

### Call the `getSession` function: [API Reference](../api-reference/get-session)
```js
supertokens.getSession(req, res, enableCsrfProtection);
```
- Use this function at the start of each API call to authenticate the user.
- You can either call the function directly in each API, or create a [middleware](#writing-your-own-session-middleware) out of it as per your requirements.
- This will return a `Session` object. Please see [this](./session-object) section for information with what you can do with this.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

app.post("/like-comment", function (req, res) {
    // NOTE: you can also use async/await here
    supertokens.getSession(req, res, true).then(session => {
        let userId = session.getUserId();
        /*
         * rest of API logic...
         */ 
        res.send("Like successful :)");
    }).catch(err => {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                res.status(500).send("Something went wrong");
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                // all cookies have been cleared
                res.status(440).send("Session expired! Please login again");
            } else {    // TRY_REFRESH_TOKEN
                // cookies are not cleared since we only need to refresh the session
                res.status(440).send("Please call refresh token endpoint");
            }
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
    });
});
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node';
import { Request, Response } from "express";

app.post("/like-comment", function (req: Request, res: Response) {
    // NOTE: you can also use async/await here
    supertokens.getSession(req, res, true).then(session: supertokens.Session => {
        let userId = session.getUserId();
        /*
         * rest of API logic...
         */ 
        res.send("Like successful :)");
    }).catch(err: any => {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                res.status(500).send("Something went wrong");
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                // all cookies have been cleared
                res.status(440).send("Session expired! Please login again");
            } else {    // TRY_REFRESH_TOKEN
                // cookies are not cleared since we only need to refresh the session
                res.status(440).send("Please call refresh token endpoint");
            }
        } else {
            res.status(500).send(err);  // Something went wrong.
        }
    });
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

#### Writing your own session middleware
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

// do not call this middleware for refresh token APIs.
async function superTokensMiddleware (req, res, next) {
    try {
        let session = await supertokens.getSession(req, res, true);
        req.session = session;
        next();
    } catch (err) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                next(err);
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                // redirect to login page.
            } else {    // TRY_REFRESH_TOKEN
                res.status(440).send("Please call the refresh token endpoint");
            }
        } else {
            next(err);
        }
    }
}

// app.use(superTokensMiddleware);

// other routes / middlewares
app.post("/like-comment", superTokensMiddleware, function (req, res) {
    // your API logic. req.session contains user infomation
});
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node';
import { Request, Response, NextFunction } from "express";

// do not call this middleware for refresh token APIs.
async function superTokensMiddleware (req: Request, res: Response, next: NextFunction) {
    try {
        let session: supertokens.Session = await supertokens.getSession(req, res, true);
        req.session = session;
        next();
    } catch (err: any) {
        if (supertokens.Error.isErrorFromAuth(err)) {
            if (err.errType === supertokens.Error.GENERAL_ERROR) {
                next(err);
            } else if (err.errType === supertokens.Error.UNAUTHORISED) {
                // redirect to login page.
            } else {    // TRY_REFRESH_TOKEN
                res.status(440).send("Please call the refresh token endpoint");
            }
        } else {
            next(err);
        }
    }
}

// app.use(superTokensMiddleware);

// other routes / middlewares
app.post("/like-comment", superTokensMiddleware, function (req: Request, res: Response) {
    // your API logic. req.session contains user infomation
});
```
<!--END_DOCUSAURUS_CODE_TABS-->