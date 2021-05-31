---
id: version-4.4.X-reading-userid
title: Reading the User ID
hide_title: true
original_id: reading-userid
---

# Reading the User ID

### The ```getUserId``` function: [API Reference](../api-reference/axios#getuserid)

<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website/axios';

let userId = SuperTokensRequest.getUserId();
```
<!--Via script tag-->
```js
supertokens.axios.getUserId();
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Returns a ```string``` or throws an error in case a session does not exist

