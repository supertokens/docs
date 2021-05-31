---
id: version-1.0.X-overview
title: Overview
hide_title: true
original_id: overview
---

# Error Handling Overview

All our functions will throw one of these four types of errors:
- **[GENERAL_ERROR](./general-error)**
- **[UNAUTHORISED](./unauthorised)**
- **[TRY_REFRESH_TOKEN](./try-refresh-token)**
- **[TOKEN_THEFT_DETECTED](./token-theft-detected)**

> To detect if the error thrown from supertokens-node lib, use the function [`isErrorFromAuth`](../api-reference/is-error-from-auth). If the error is thrown by supertokens-node library, it will always be a supertokens.ERROR object.

<!-- <div class="specialNote" style="margin-bottom: 20px">
> To detect if the error thrown from supertokens-node lib, use the function <a href="../api-reference/is-error-from-auth"><b>isErrorFromAuth</b></a>. If the error is thrown by supertokens-node library, it will always be a supertokens.ERROR object.
</div> -->

The above are all ```enums``` and their number value, as seen on the console, are:
- ```GENERAL_ERROR```: ```1000```
- ```UNAUTHORISED```: ```2000```
- ```TRY_REFRESH_TOKEN```: ```3000```
- ```TOKEN_THEFT_DETECTED```: ```4000```

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

app.post("/like-comment", function (req, res) {
    supertokens.getSession(req, res, true).then(session => {
        // ...
    }).catch(err => {
        if (supertokens.Error.isErrorFromAuth(err)) {  // we check if this error was generated from the SuperTokens lib
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
    supertokens.getSession(req, res, true).then(session: supertokens.Session => {
        // ...
    }).catch(err: any => {
        if (supertokens.Error.isErrorFromAuth(err)) {  // we check if this error was generated from the SuperTokens lib
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