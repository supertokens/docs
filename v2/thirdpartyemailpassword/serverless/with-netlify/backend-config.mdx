---
id: backend-config
title: 2. Backend config
hide_title: true
---

# 2. Backend config

## 1) Install supertokens package
```bash
npm i supertokens-node
```

## 2) Create a configuration file (`config/supertokensConfig.js`)
- Create a `config` folder in the root directory of your project.
- Create a `supertokensConfig.js` inside the `config` folder.
- An example of this file can be found [here](https://github.com/supertokens/supertokens-auth-react/blob/master/examples/with-netlify/config/supertokensConfig.js).


## 3) Create a backend config function
This function will return the config object used to configure `supertokens-node`:
- Add secrets for your third party login providers.
- All configuration options can be found [here](/docs/nodejs/thirdpartyemailpassword/init).
- You will need to replace the `supertokens` object's `connectionURI` with the location of your core. You may also need to add an `apiKey`.
- You can also use `process.env.SITE_NAME + ".netlify.app"` as the value for `websiteDomain` and for `apiDomain`.
- Be sure to add `apiBasePath: "/.netlify/functions/auth"` as well in the `appInfo` object. To learn more about this config, please visit [the appInfo page](../../appinfo).

<!--DOCUSAURUS_CODE_TABS-->
<!--/config/supertokensConfig.js-->
```js

let ThirdPartyEmailPassword = require('supertokens-node/recipe/thirdpartyemailpassword');
let Session = reqiure('supertokens-node/recipe/session')

function getBackendConfig() {
  return {
    supertokens: {
      connectionURI: 'https://try.supertokens.io',
    },
    appInfo: {
      // learn more about this on https://supertokens.io/docs/thirdpartyemailpassword/appinfo
      appName: "YOUR APP NAME", // Example: "SuperTokens",
      apiDomain: "YOUR API DOMAIN", // Example: "http://localhost:8080",
      websiteDomain: "YOUR WEBSITE DOMAIN", // Example: "http://localhost:8080"
      apiBasePath: "/.netlify/functions/auth"
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
        providers: [
          ThirdPartyEmailPassword.Google({
            clientSecret: "TODO ADD SECRET",
            clientId: "TODO ADD SECRET",
          }),
          ThirdPartyEmailPassword.Facebook({
            clientSecret: "TODO ADD SECRET",
            clientId: "TODO ADD SECRET",
          }),
        ],
      }),
      Session.init(),
    ],
    isInServerlessEnv: true,
  }
}

module.exports.getBackendConfig = getBackendConfig;

```
<!--END_DOCUSAURUS_CODE_TABS-->

<div class="specialNote" style="margin-bottom: 40px">
Please refer to the corresponding documentations to get your client ids and client secrets for each of the below providers:<br/>
  - <a href="https://developers.google.com/identity/sign-in/web/sign-in#create_authorization_credentials" rel="noopener noreferrer" target="_blank" >Google</a> (callback URL is <code>{websiteDomain}/auth/callback/google</code>)<br/>
  - <a href="https://developers.facebook.com/docs/development/create-an-app" rel="noopener noreferrer" target="_blank" >Facebook</a> (callback URL is <code>{websiteDomain}/auth/callback/facebook</code>)<br/><br/>

In general, the callback URL is `{websiteDomain}{websiteBasePath}/callback/{id}` where `id` is the unique id for the auth provider, and `websiteBasePath` by default is `/auth`.
</div>