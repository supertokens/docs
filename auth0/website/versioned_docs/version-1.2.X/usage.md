---
id: version-1.2.X-usage
title: Usage
hide_title: true
original_id: usage
---

# Usage

## Initialisation
A dependency of our modified Auth0 library is our `supertokens-website` package. This is automatically downloaded. You need to call the `init` function for that:

1) If using `fetch`, please see [this page](/docs/website/fetch/init)

2) If using `axios`, please see [this page](/docs/website/axios/init)


## Changes
- Change all imports of `@auth0/auth0-spa-js` to `supertokens-auth0-spa-js` and all imports of `@auth0/auth0-react` to `supertokens-auth0-react`

- You no longer need to use `getTokenSilently` & `getTokenWithPopup`. This implies that you do not have to put Auth0's access token as a header in any of your API calls.

- On the Auth0 dashboard, please make sure that you have **not** selected rotating refresh tokens.

- In your code, set: 
    - `useRefreshToken` to `true`
    - `cacheLocation` to `"localstorage"`. This is OK from a security point of view since only the Auth0 ID Token is being stored in the `localstorage`.

- Please refer to `@auth0/auth0-spa-js` or `@auth0/auth0-react` documentation since the interface is the same.

- Please see the docs for your SuperTokens [backend SDK](/docs/community/2.5.X/backend-integration) to complete the Auth0 integration.


## Changing backend URL Path (Optional)
By default, the SDK will query `/supertokens-auth0 POST` API on your backend. To change this, you can set your own path like so:

<!--DOCUSAURUS_CODE_TABS-->
<!--Using fetch-->
```js
import SuperTokensRequest from 'supertokens-website';

SuperTokensRequest.init({
    refreshTokenUrl: "https://api.example.com/session/refresh"
});

// this will query https://api.example.com/custom-auth0-path
SuperTokensRequest.setAuth0API("/custom-auth0-path");
```
<!--Using axios-->
```js
import SuperTokensRequest from 'supertokens-website/axios';

SuperTokensRequest.init({
    refreshTokenUrl: "https://api.example.com/session/refresh"
});

// this will query https://api.example.com/custom-auth0-path
SuperTokensRequest.setAuth0API("/custom-auth0-path");
```
<!--END_DOCUSAURUS_CODE_TABS-->