---
id: version-4.1.X-facebook
title: Facebook
hide_title: true
original_id: facebook
---

# Facebook

The Facebook third party provider can be customized using the following config:

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
__HIGHLIGHT__                    ThirdParty.Facebook({
                        clientSecret: "FACEBOOK_CLIENT_SECRET",
                        clientId: "FACEBOOK_CLIENT_ID",
                        scope: [
                            "additionalFeatureURL",
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
  - type: `String`
  - description: It is a secret used only for authorisation in server-side operations.

- `clientId`
  - type: `String`
  - description: It is the public identifier for the app.

- `scope`
  - type: `String[]`
  - description: It is a string array which defines your applications access to a users account, by default users email is accessed. Additional features can be found [here](https://developers.facebook.com/docs/permissions/reference/)

<div class="specialNote" style="margin-bottom: 40px">
To get your client id and client secret please refer to the following
<a href="https://developers.facebook.com/docs/development/create-an-app" rel="noopener noreferrer" target="_blank" >documentation</a>
</div>
