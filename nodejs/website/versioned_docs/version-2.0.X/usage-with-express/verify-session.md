---
id: version-2.0.X-verify-session
title: Verify Session
hide_title: true
original_id: verify-session
---

# Verify Session

### Use `supertokens.middleware()`
```js
supertokens.middleware(enableCsrfProtection?)
```
- All APIs that require a valid session must use this middleware.
- If `enableCsrfProtection` is `undefined`, CSRF protection will be applied to all non-GET and non-OPTIONS APIs automatically.
- If successful, it will create a [session object](./session-object) that can be accessed via `request.session`.
- This uses the [`getSession()`](../api-reference/get-session) function.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

app.post("/like-comment", supertokens.middleware(), function (req, res) {
    let userId = req.session.getUserId();
    res.send(userId);
});
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node';

app.post("/like-comment", supertokens.middleware(), function (req: supertokens.Type.SessionRequest, res) {
    let userId = req.session.getUserId();
    res.send(userId);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->