---
id: new-session
title: Storing data in a session
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./thirdpartyemailpassword/docs/common-customizations/sessions/new-session.md -->

# Storing data in a session

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


The default values can be changed by overriding the `createNewSession` function in the `Session` recipe:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let SuperTokens = require("supertokens-node");
let Session = require("supertokens-node/recipe/session);

SuperTokens.init({
    SuperTokens: {...},
    appInfo: {...},
    recipeList: [
        ...
        Session.init({
__HIGHLIGHT__            override: {
                functions: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        createNewSession: async (input) => {
                            let userId = input.userId;

                            input.jwtPayload = {
                                ...input.jwtPayload,
                                someKey: "someValue",
                            };

                            input.sessionData = {
                                ...input.sessionData,
                                someKey: "someValue",
                            };

                            return originalImplementation.createNewSession(input);
                        },
                    };
                },
            }, __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->
