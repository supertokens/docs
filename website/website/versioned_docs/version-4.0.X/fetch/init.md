---
id: version-4.0.X-init
title: Initialisation
hide_title: true
original_id: init
---

# Initialisation

### The init function: [API Reference](../api-reference/fetch#initrefreshtokenurl-sessionexpiredstatuscode-viainterceptor-websiterootdomain-refreshapicustomheaders)

<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website';

SuperTokensRequest.init("https://api.example.com/api/refresh", 440, true, "example.com", {});
```
<!--Via script tag-->
```js
supertokens.fetch.init("https://api.example.com/api/refresh", 440, true, "example.com", {});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- To be called at least once before any http request is made to any of your APIs that require authentication.
- You only need to call this once in your SPA app or on page load.
- Please see the API reference link above to understand the meaning of the various parameters.