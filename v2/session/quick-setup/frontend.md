---
id: frontend
title: Frontend
hide_title: true
---

# Frontend setup

## 1️⃣ npm install

<!--DOCUSAURUS_CODE_TABS-->
<!--With ReactJS-->
```bash
npm i -s supertokens-auth-react
```

<!--Plain JS-->
```bash
npm i -s supertokens-website
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 2️⃣ Call the `init` function

<!--DOCUSAURUS_CODE_TABS-->
<!--With ReactJS-->
```js
import React from 'react';

__HIGHLIGHT__ import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    appInfo: {
        // learn more about this on https://supertokens.io/docs/session/appinfo
        appName: "YOUR APP NAME", // Example: "SuperTokens",
        apiDomain: "YOUR API DOMAIN", // Example: "https://api.supertokens.io",
        websiteDomain: "YOUR WEBSITE DOMAIN" // Example: "https://supertokens.io"
    },
    recipeList: [
        Session.init()
    ]
}); __END_HIGHLIGHT__


/* Your App */
class App extends React.component {
    render() {
       return (...)
    }
}
```

<!--Plain JS-->
```js
import SuperTokensRequest from 'supertokens-website';

SuperTokensRequest.init({
    apiDomain: "https://api.example.com"
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 3️⃣ Add `axios` session interceptor
> This step is only applicable if you are using `axios`. 

Add the interceptor for each `axios` import call

<!--DOCUSAURUS_CODE_TABS-->
<!--With ReactJS-->
```js
import axios from "axios";
__HIGHLIGHT__ import Session from "supertokens-auth-react/recipe/session";
Session.addAxiosInterceptors(axios); __END_HIGHLIGHT__

async function callAPI() {
    // use axios as you normally do
    let response = await axios.get(...);
}
```
<!--Plain JS-->
```js
import axios from "axios";
__HIGHLIGHT__ import SuperTokensRequest from 'supertokens-website';
SuperTokensRequest.addAxiosInterceptors(axios); __END_HIGHLIGHT__

async function callAPI() {
    // use axios as you normally do
    let response = await axios.get(...);
}
```

<!--END_DOCUSAURUS_CODE_TABS-->

> `fetch` interceptors are added automatically.