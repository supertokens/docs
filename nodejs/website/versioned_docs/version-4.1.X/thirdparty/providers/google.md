---
id: version-4.1.X-google
title: Google
hide_title: true
original_id: google
---

# Google

The Google third party provider can be customized using the following config:

```js
let supertokens = require("supertokens-node");
let ThirdParty = require("supertokens-node/recipe/thirdparty");

supertokens.init({
    supertokens: {...},
    appInfo: {...},
    recipeList: [
    ThirdParty.init({
        signInAndUpFeature: {
                providers: [
__HIGHLIGHT__                    ThirdParty.Google({
                        clientSecret: "GOOGLE_CLIENT_SECRET",
                        clientId: "GOOGLE_CLIENT_ID",
                        scope: [
                            "additionalFeatureURL",
                        ],
                        authorisationRedirect: {
                            params: {
                                additionalParam: "additionalValue",
                            }
                        }
                    }) __END_HIGHLIGHT__
                ]
            } 
        })
    ]
});
```

## Parameters

- `clientSecret`
  - type: `String`
  - description: It is a secret used only for authorisation in server-side operations.

- `clientId`
  - type: `String`
  - description: It is the public identifier for the app.

- `scope`
  - type: `String[]`
  - description: It is a string array which defines your applications access to a users account, by default users personal info and email is accessed. Additional features can be found [here](https://developers.google.com/identity/protocols/oauth2/scopes)

- `authorisationRedirect`
  - `params`
    - type: `object`
    - description: Add additional params to authorisationRedirect.

<div class="specialNote" style="margin-bottom: 40px">
To get your client id and client secret please refer to the following
<a href="https://developers.google.com/identity/sign-in/web/sign-in#create_authorization_credentials" rel="noopener noreferrer" target="_blank" >documentation</a>
</div>
