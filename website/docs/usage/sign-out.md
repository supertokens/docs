---
id: sign-out
title: Sign Out
hide_title: true
---

# Sign out API


The `signOut` method simply revokes the session for the user.

### The ```signOut``` function: [API reference](../api-reference#signout)

<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website';

SuperTokensRequest.signOut();
```
<!--Via script tag-->
```js
supertokens.signOut();
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `signOut` method called to revoke the current session. Note that this method is asynchronous and you should wait for it to return before considering it was successful.