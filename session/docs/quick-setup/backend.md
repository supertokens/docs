---
id: backend
title: Backend
hide_title: true
---

# NodeJS Setup (5 mins)

> For serverless deployment, please see the "Serverless Deployment" section instead

## 1️⃣ npm install
```bash
npm i -s supertokens-node
```

## 2️⃣ Call the `init` function

At the top of your `index.js` file, add the following code. Be sure to replace the `appInfo` content with your specific information (as you did for the frontend)

> To learn more about filling in `appInfo`, please visit [the appInfo page](../appinfo)

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let supertokens = require("supertokens-node");
let Session = require("supertokens-node/recipe/session");

supertokens.init({
    supertokens: {
        connectionURI: "https://try.supertokens.io",
    },
    appInfo: {
        // learn more about this on https://supertokens.io/docs/session/appinfo
        appName: "YOUR APP NAME", // Example: "SuperTokens",
        apiDomain: "YOUR API DOMAIN", // Example: "https://api.supertokens.io",
        websiteDomain: "YOUR WEBSITE DOMAIN" // Example: "https://supertokens.io"
    },
    recipeList: [
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

If you noticed, we used `https://try.supertokens.io` as the `connectionURI` above. This is a Core that we are hosting for the demo app. 

You can continue to use this for as long as you like, but once you are more committed to using SuperTokens, you will need to run a Core dedicated for your app.

## 3️⃣ Add the SuperTokens and CORS middleware
Add the `middleware` **BEFORE all your routes**.


<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let cors = require("cors");
let supertokens = require("supertokens-node");

supertokens.init({...}) // from step 2

let app = express();

// ...other middlewares
app.use(cors({
    origin: websiteUrl,
    allowedHeaders: ["content-type", __HIGHLIGHT_PHRASE__ ...supertokens.getAllCORSHeaders() __END_HIGHLIGHT_PHRASE__],
__HIGHLIGHT__    credentials: true, __END_HIGHLIGHT__
}));

__HIGHLIGHT__ app.use(supertokens.middleware()); __END_HIGHLIGHT__

// ...your API routes
```
<!--END_DOCUSAURUS_CODE_TABS-->

This `middleware` automatically adds the session refresh API:
- `POST /auth/session/refresh`: It is used to get a new refresh and access token in case the older one expires.
- `POST /auth/signout`: It is used sign out the currently logged in user.

`/auth/` is a base path that [can be changed](../common-customizations/changing-base-path/api-base-path) if you want. 

## 4️⃣ Add the SuperTokens error handler
Add the `errorHandler` **AFTER all your routes**, but **BEFORE your error handler**


<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
// ...your API routes

__HIGHLIGHT__ app.use(supertokens.errorHandler()) __END_HIGHLIGHT__

// your own error handler
app.use((err, req, res, next) => {...});

```
<!--END_DOCUSAURUS_CODE_TABS-->

## 6️⃣ Add session verification to your API
For your APIs that require a user to be logged in, use the `verifySession` middleware:


<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let Session = require("supertokens-node/recipe/session");

app.post("/like-comment", __HIGHLIGHT_PHRASE__ Session.verifySession() __END_HIGHLIGHT_PHRASE__, (req, res) => {
__HIGHLIGHT__    let userId = req.session.getUserId(); __END_HIGHLIGHT__
    //....
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

---------------

# Minimum setup completed 🎉🥳
Congratulations! You now have a fully functional session system!

The next steps is to setup your SuperTokens core instance.