---
id: version-6.0.X-server-side-rendering
title: For server side rendering
hide_title: true
original_id: server-side-rendering
---

# Server side rendering - manual refresh

For server side rendered apps, there will be instances when the access token has expired. In these cases, you need to use the refresh token to get a new access and a new refresh token. However, the refresh token is only sent to one special refresh API, which means that for all other APIs, you will not have the refresh token as an input. To solve this problem, those other APIs should send a response that manually refreshes the session and re-calls this API. 

### The ```attemptRefreshingSession``` function: [API reference](../api-reference#attemptrefreshingsession)

<!--DOCUSAURUS_CODE_TABS-->
<!--Via NPM-->
```ts
import SuperTokensRequest from 'supertokens-website';

await SuperTokensRequest.attemptRefreshingSession();
```
<!--Via script tag-->
```js
await supertokens.attemptRefreshingSession();
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Calling the above function will result in a call to your refresh API. If refreshing succeeds, this function will return a ```Promise``` that will resolve to ```true```, else ```false```.
- If successful, you can automatically reload the page and the new access token will be sent to your API.
- If unsuccessful, then you should redirect the user to the login page.