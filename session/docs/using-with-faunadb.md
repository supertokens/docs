---
id: using-with-faunadb
title: Using with FaunaDB
hide_title: true
---

# Using with FaunaDB

> This integration only works if you have stored your users in FaunaDB. So, in case you are using Auth0, Okta, or store your users outside of FaunaDB, you will need to [wait for our integration](https://github.com/supertokens/supertokens-core/issues/122) to support it.

SuperTokens provides an integration with FaunaDB that allows you to:
- Create a Fauna token for a user who just logged in
- Access the Fauna user token on your frontend client and backend APIs, so that you can query FaunaDB from anywhere
- Securely refresh the session and Fauna user token automatically
- Automatically revoke the Fauna user token when the session associated with that user is revoked.

> This integration is only available for NodeJS as of now. If you would like additional tech stack support, please [open an issue on our Github](https://github.com/supertokens/supertokens-core/issues).

## Integration

### 1️⃣ Complete the [Quick setup guide](/docs/session/quick-setup/frontend)
- Make sure you have completed the frontend, backend and SuperTokens core setup.

### 2️⃣ Change import statements on the backend
Replace ALL `require("supertokens-node/recipe/session")` with
```js
require("supertokens-node/recipe/session/faunadb")
```

### 3️⃣ Add FaunaDB options to the `Session.init()` function
<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let supertokens = require("supertokens-node");
__HIGHLIGHT__ let Session = require("supertokens-node/recipe/session/faunadb"); __END_HIGHLIGHT__

supertokens.init({
    supertokens: {...},
    appInfo: {...},
    recipeList: [
__HIGHLIGHT__        Session.init({
            faunadbClient: new faunadb.Client({
                secret: "...",
                // ...
            }),
            userCollectionName: "COLLECTION NAME",
            accessFaunadbTokenFromFrontend: false
        }) __END_HIGHLIGHT__
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

### 4️⃣ Creating a new session
On login, you would want to create a new session using the "FaunaDB reference ID" of the logged in user.

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let Session = require("supertokens-node/recipe/session/faunadb");

app.post("/login", async function (req, res) {
    // check for user credentials..

__HIGHLIGHT__    let userId = "<FAUNADB REFERENCE ID>";
    await Session.createNewSession(res, userId); __END_HIGHLIGHT__
    res.send("logged in");
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

### 5️⃣ Retrieve the Fauna user token in any API
After session verification, you can use the [`session.getFaunadbToken()`](/docs/nodejs/session/sessioncontainer/getfaunadbtoken) function in the API

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let Session = require("supertokens-node/recipe/session/faunadb");

app.post("/like-comment", Session.verifySession(), function (req, res) {
    let userId = req.session.getUserId();
__HIGHLIGHT__    let faunaToken = await req.session.getFaunadbToken(); __END_HIGHLIGHT__

    // query FaunaDB on behalf of the currently logged in user.
    
    res.send(userId);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

### 6️⃣ Retrieve the Fauna user token on the frontend

> In order to do this, you will need to set `accessFaunadbTokenFromFrontend` to `true` when calling `Session.init` on the backend.

Then on the frontend, once a user logs in, you can retrieve the JWT payload and use the key `"faunadbToken"` to read the token. Here is an example

<!--DOCUSAURUS_CODE_TABS-->
<!--With ReactJS-->

```js

import Session from 'supertokens-auth-react/recipe/session';

let jwtPayload = await Session.getJWTPayloadSecurely();
let faunadbToken = jwtPayload["faunadbToken"];

// query FaunaDB...
```

<!--Plain JS-->

```js

import SuperTokens from 'supertokens-website';

let jwtPayload = await SuperTokens.getJWTPayloadSecurely();
let faunadbToken = jwtPayload["faunadbToken"];

// query FaunaDB...
```

<!--END_DOCUSAURUS_CODE_TABS-->