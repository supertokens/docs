---
id: version-2.5.X-faunadb-integration
title: FaunaDB Integration
hide_title: true
original_id: faunadb-integration
---

# FaunaDB Integration
SuperTokens makes it very simple for you to manage a logged in user's FaunaDB token - you can retrieve it on your backend or frontend whenever you want, and we make sure that it's never expired.

## 1) Change imports
In your `import / require` statements, change `"supertokens-node"` to `"supertokens-node/faunadb"`.


## 2) Add FaunaDB options to the `init` function
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let supertokens = require("supertokens-node/faunadb");

let app = express();

app.use(supertokens.init({
    hosts: "http://localhost:3567;https://try.supertokens.com",
    apiKey: "key",
    faunadbSecret: "FAUNADB SERVER KEY",
    userCollectionName: "COLLECTION NAME",
}));
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node/faunadb";

let app = express();

app.use(supertokens.init({
    hosts: "http://localhost:3567;https://try.supertokens.com",
    apiKey: "key",
    faunadbSecret: "FAUNADB SERVER KEY",
    userCollectionName: "COLLECTION NAME",
}));
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `faunadbSecret`: This is your FaunaDB server secret key. This is only used for issuing new, temporary tokens for your users.

- `userCollectionName`:  This should be the name of the collection that contains user's information.

- `accessFaunadbTokenFromFrontend`: This `boolean` determines if the FaunaDB token that's issued for a user is also accessible on your frontend. By default, it's `false`, which means that user tokens will only be accessible in your APIs.


## 3) Use FaunaDB reference ID as the `userId`
The reference ID of the document that contains the user's information should be used as the `userId` when creating a new session

<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node/faunadb");

app.post("/login", async function (req, res) {
    // check for user credentials..

    let userId = "<FAUNADB REFERENCE ID>";
    await supertokens.createNewSession(res, userId);
    res.send("logged in");
});
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node/faunadb';

app.post("/login", async function (req, res) {
    // check for user credentials..

    let userId = "<FAUNADB REFERENCE ID>";
    await supertokens.createNewSession(res, userId);

    res.send("logged in");
});
```
<!--END_DOCUSAURUS_CODE_TABS--> 

## 4) Retrieve the user's FaunaDB token in any API
### `session.getFaunadbToken()` function: [API Reference](../api-reference/session-object/get-faunadb-token)

<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node/faunadb");

app.post("/like-comment", supertokens.middleware(), function (req, res) {
    let userId = req.session.getUserId();
    let faunaToken = await req.session.getFaunadbToken();

    // query FaunaDB on behalf of the currently logged in user.
    
    res.send(userId);
});
```
<!--Typescript-->
```ts
import * as supertokens from 'supertokens-node/faunadb';

app.post("/like-comment", supertokens.middleware(), function (req: supertokens.Type.SessionRequest, res) {
    let userId = req.session.getUserId();
    let faunaToken = await req.session.getFaunadbToken();
    
    // query FaunaDB on behalf of the currently logged in user.
    
    res.send(userId);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 5) Retrieve the user's FaunaDB token on the frontend
In order to do this, you need to set the `accessFaunadbTokenFromFrontend` variable to `true` when calling the `init` function (see above, point 2)

Once a user logs in, you can retrieve the JWT payload on the frontend, and use the key `"faunadbToken"` to read the token. Here is an example of how to retrieve this on your website:

```ts
// **This is on your frontend**

import SuperTokensRequest from 'supertokens-website';

let jwtPayload = await SuperTokensRequest.getJWTPayloadSecurely();
let faunadbToken = jwtPayload["faunadbToken"];

// query FaunaDB...
```