---
id: github
title: Github
hide_title: true
---

# Github

The Github third party provider can be customized using the following config:

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
__HIGHLIGHT__                    ThirdParty.Github({
                        clientSecret: "GITHUB_CLIENT_SECRET",
                        clientId: "GITHUB_CLIENT_ID",
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
  - description: It is a string array which defines your applications access to a users account, by default it grants read/write access to profile info only. Additional features can be found [here](https://docs.github.com/en/developers/apps/scopes-for-oauth-apps)

- `authorisationRedirect`
  - `params`
    - type: `object`
    - description: Add additional params to authorisationRedirect.

<div class="specialNote" style="margin-bottom: 40px">
To get your client id and client secret please refer to the following
<a href="https://docs.github.com/en/developers/apps/creating-an-oauth-app" rel="noopener noreferrer" target="_blank" >documentation</a>
</div>
