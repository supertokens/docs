---
id: version-4.4.X-reading-jwt-payload
title: Reading the JWT Payload
hide_title: true
original_id: reading-jwt-payload
---

# Reading the JWT Payload (Securely)

### The ```getJWTPayloadSecurely``` function: [API Reference](../api-reference/axios#getjwtpayloadsecurely)

<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website/axios';

let payload = await SuperTokensRequest.getJWTPayloadSecurely();
```
<!--Via script tag-->
```js
await supertokens.axios.getJWTPayloadSecurely();
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Returns a ```Promise<JSON object>``` or throws an error in case reading failed.
- This does not read from the access token, since that is in `httpOnly` cookie. Instead, it reads from another token that contains a copy of the payload in the access token. 

