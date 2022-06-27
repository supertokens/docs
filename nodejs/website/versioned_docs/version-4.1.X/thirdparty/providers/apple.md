---
id: version-4.1.X-apple
title: Apple
hide_title: true
original_id: apple
---

# Apple

The Apple third party provider can be customized using the following config:

```js
let supertokens = require("supertokens-node");
let ThirdParty = require("supertokens-node/recipe/thirdparty");

clientId: string;
    clientSecret: {
        keyId: string;
        privateKey: string;
        teamId: string;
    };
    scope?: string[];
    authorisationRedirect?: {
        params?: { [key: string]: string | ((request: Request) => string) };
    };

supertokens.init({
    supertokens: {...},
    appInfo: {...},
    recipeList: [
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [
__HIGHLIGHT__                    ThirdParty.Apple({
                        clientId: "APPLE_CLIENT_ID",
                        clientSecret: {
                            keyId: "APPLE_KEY_ID",
                            privateKey: "APPLE_PRIVATE_KEY",
                            teamId: "APPLE_TEAM_ID"
                        },
                        scope: [
                            "additionalScope",
                        ]
                    }) __END_HIGHLIGHT__
                ]
            }
        })
    ]
});
```

## Parameters

- `clientSecret`
  - type: `Object`
  - description: It is a secret that contains a keyId, privateKey and teamId used for authorisation in server-side operations.

- `clientId`
  - type: `String`
  - description: It is the public identifier for the app.

- `scope`
  - type: `String[]`
  - description: It is a string array which defines your applications access to a users account, by default users email is accessed. Additional features can be found [here](https://developer.apple.com/documentation/sign_in_with_apple/clientconfigi/3230955-scope)

<div class="specialNote" style="margin-bottom: 40px">
To get your client id and client secret please refer to the following
<a href="https://docs.mongodb.com/realm/authentication/apple/" rel="noopener noreferrer" target="_blank" >documentation</a>
</div>
