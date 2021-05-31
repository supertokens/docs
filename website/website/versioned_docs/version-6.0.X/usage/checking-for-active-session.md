---
id: version-6.0.X-checking-for-active-session
title: Checking if a session exists
hide_title: true
original_id: checking-for-active-session
---

# Checking if a session exists

### The ```doesSessionExist``` function: [API Reference](../api-reference#doessessionexist)

<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website';

await SuperTokensRequest.doesSessionExist();
```
<!--Via script tag-->
```js
await supertokens.doesSessionExist();
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Returns a ```boolean```
- If ```true```: There is an active session.
- If ```false```: There is no active session.

