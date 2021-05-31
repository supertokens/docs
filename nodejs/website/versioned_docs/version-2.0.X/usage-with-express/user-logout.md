---
id: version-2.0.X-user-logout
title: Logout / Revoke Session
hide_title: true
original_id: user-logout
---

# Logout / Revoke Session

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

app.use("/logout", supertokens.middleware(), async (req, res) => {

    await req.session.revokeSession();

    res.send("Success! Go to login page");
});
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

app.use("/logout", supertokens.middleware(), async (req: supertokens.Type.SessionRequest, res) => {

    await req.session.revokeSession();
    
    res.send("Success! Go to login page");
});
```
<!--END_DOCUSAURUS_CODE_TABS-->