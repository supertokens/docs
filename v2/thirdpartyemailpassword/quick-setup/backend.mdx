---
id: backend
title: Backend
hide_title: true
---

# NodeJS Setup (5 mins)

> For framework specific implementation (like Next.js), please skip this section and go directly to the section with the name of your framework. 

> For serverless deployment, please see the "Serverless Deployment" section instead

This library provides a set of functions and default APIs required for authentication.

### An example implementation can be [found here](https://github.com/supertokens/supertokens-demo-react/blob/thirdpartyemailpassword/api-server.js).

## 1️⃣ npm install
```bash
npm i -s supertokens-node
```

## 2️⃣ Call the `init` function

At the top of your `index.js` file, add the following code. Please make sure to replace all the `appInfo` configurations values with yours (The values should be the same as on the frontend).

> To learn more about filling in `appInfo`, please visit [the appInfo page](../appinfo)

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let supertokens = require("supertokens-node");
let Session = require("supertokens-node/recipe/session");
let ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");
let {Google, Github, Facebook} = ThirdPartyEmailPassword;

supertokens.init({
    supertokens: {
        connectionURI: "https://try.supertokens.io",
    },
    appInfo: {
        // learn more about this on https://supertokens.io/docs/thirdpartyemailpassword/appinfo
        appName: "YOUR APP NAME",
        apiDomain: "YOUR API DOMAIN",
        websiteDomain: "YOUR WEBSITE DOMAIN"
    },
    recipeList: [
        ThirdPartyEmailPassword.init({
            providers: [
                    Google({
                        clientSecret: "GOOGLE_CLIENT_SECRET",
                        clientId: "GOOGLE_CLIENT_ID"
                    }),
                    Github({
                        clientSecret: "GITHUB_CLIENT_SECRET",
                        clientId: "GITHUB_CLIENT_ID"
                    }),
                    Facebook({
                        clientSecret: "FACEBOOK_CLIENT_SECRET",
                        clientId: "FACEBOOK_CLIENT_ID"
                    })
                ]
        }),
        Session.init() // initializes session features
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

<div class="specialNote" style="margin-bottom: 40px">
Please refer to the corresponding documentations to get your client ids and client secrets for each of the below providers:<br/>
  - <a href="https://developers.google.com/identity/sign-in/web/sign-in#create_authorization_credentials" rel="noopener noreferrer" target="_blank" >Google</a> (callback URL is <code>{websiteDomain}/auth/callback/google</code>)<br/>
  - <a href="https://docs.github.com/en/developers/apps/creating-an-oauth-app" rel="noopener noreferrer" target="_blank" >Github</a> (callback URL is <code>{websiteDomain}/auth/callback/github</code>)<br/>
  - <a href="https://developers.facebook.com/docs/development/create-an-app" rel="noopener noreferrer" target="_blank" >Facebook</a> (callback URL is <code>{websiteDomain}/auth/callback/facebook</code>)<br/><br/>

In general, the callback URL is `{websiteDomain}{websiteBasePath}/callback/{id}` where `id` is the unique id for the auth provider, and `websiteBasePath` by default is `/auth`.
</div>

**Make sure that the above configurations for "CLIENT_SECRET" are stored in your environment variables and not directly in your javascript files for security reasons.**

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

This `middleware` automatically adds a few APIs:
- `POST /auth/signinup`: For signing up/signing in a user using a thirdparty provider.
- `POST /auth/signup`: For signing up a user with email & password
- `POST /auth/signin`: For signing in a user with email & password
- More APIs can be found here:
   - [ThirdParty APIs](/docs/nodejs/thirdparty/default-apis)
   - [Emailpassword APIs](/docs/nodejs/emailpassword/default-apis)
   - [Session APIs](/docs/nodejs/session/default-apis)

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

## 5️⃣ Test if sign up is setup correctly
- Go to the `/auth` route of your website
- Try to sign up.
- If after signing up, you are redirected to `/`, everything is setup correctly 😁
- If not, don't worry, you can always ask for help via [Github issues](https://github.com/supertokens/supertokens-core/issues) or via [our Discord](https://supertokens.io/discord)

## 6️⃣ Add session verification
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
Congratulations! You now have a fully functional login and session system!

The next steps is to setup your SuperTokens core instance.