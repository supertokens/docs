---
id: new-session
title: Storing session data
hide_title: true
---

# Storing session data

> A session is created automatically when the user signs in or signs up.

A session can hold two types of data:
- JWT payload: 
    - The access token is a JWT (JSON web token). The contents of the JWT is called the JWT payload. 
    - This content is instantly (without a db call) accessible post session verification in an API, and is also accessible on the frontend.
    - The contents can be changed anytime post session verification.
    - An example of what can be stored in this is a user's role.
    - The default value is `{}`
- Session data:
    - This data is stored in the database, mapped against a session (each session has a constant ID called the `sessionHandle`).
    - A `sessionHandle` can be obtained post session verification in an API, after which this data can be fetched / changed.
    - Use this to store any sensitive data associated with a session, that should not be sent to the frontend.
    - The default value is `{}`


The default values can be changed by configuring `setJwtPayload` and `setSessionData` in the `sessionFeature` attribute when initializing the recipe:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let SuperTokens = require("supertokens-node");
let ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");

SuperTokens.init({
    SuperTokens: {...},
    appInfo: {...},
    recipeList: [
__HIGHLIGHT__        ThirdPartyEmailPassword.init({
            sessionFeature: {
               setJwtPayload: async (user, context, action) => {
                   // The value of "action" is "signin" | "signup"
                   // The value of context depends on which method (emailpassword/thirdparty) is used to perform the above "action".
                   return { someKey: "someValue" }
               },
               setSessionData: async (user, context, action) => {
                   // The value of "action" is "signin" | "signup"
                   // The value of context depends on which login type(emailpassword/thirdparty) is used to perform the above "action".
                   return { someKey: "someValue" }
               }
            } __END_HIGHLIGHT__
        }),
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->