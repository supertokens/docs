---
id: assigning-session-roles
title: Assigning roles to a session 
hide_title: true
---

# Assigning roles to a session

This can be done at two points in time:
1) During user login / sign up
2) In any API call post login

## 1) During user login / sign up

We can set a JWT payload to store the user's role by overriding the `setJwtPayload` in the `init` function:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let SuperTokens = require("supertokens-node");
let ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");

SuperTokens.init({
    SuperTokens: {...},
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
__HIGHLIGHT__            sessionFeature: {
               setJwtPayload: async (user, context, action) => {
                    // This is called post sign in and sign up
                    let {email, id} = user;

                    let role = "admin"; // TODO: fetch based on user

                    return { role }
               }
            } __END_HIGHLIGHT__
        }),
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 2) In any API call post login

Post session verification, you can use the `updateJWTPayload` function to store the user's role:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let Session = require("supertokens-node/recipe/session");

app.post("/set-role", __HIGHLIGHT_PHRASE__ Session.verifySession() __END_HIGHLIGHT_PHRASE__, (req, res) => {
    let userId = req.session.getUserId();

    let role = "admin"; // TODO: fetch based on user

    // Note that this will override any existing JWT payload
    // that you may have provided earlier.
__HIGHLIGHT__    await req.session.updateJWTPayload({
        role
    }); __END_HIGHLIGHT__

    //....
});
```
<!--END_DOCUSAURUS_CODE_TABS-->