---
id: version-4.3.X-init
title: Initialisation
hide_title: true
original_id: init
---

# Initialisation

### The init function: [API Reference](../api-reference/axios#init-refreshtokenurl-sessionexpiredstatuscode-websiterootdomain-refreshapicustomheaders-autoaddcredentials)

<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website/axios';

SuperTokensRequest.init({
    refreshTokenUrl: "https://api.example.com/session/refresh"
});
```
<!--Via script tag-->
```js
supertokens.axios.init({
    refreshTokenUrl: "https://api.example.com/session/refresh"
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- To be called at least once before any http request is made to any of your APIs that require authentication.
- You only need to call this once in your SPA app or on page load.
- Please see the API reference link above to understand the meaning of the various parameters.