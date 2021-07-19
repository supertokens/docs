---
id: cookies-and-https
title: Cookies and Https
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./session/common-customizations/sessions/cookies-and-https.md -->

# Cookies and Https

SuperTokens ensures that cookies are secured by enabling the ``secure`` flag when generating session cookies.

> Supertokens automatically determines the value for the ``secure`` attribute based on your API domain having `http` or `https`, unless explicitly set by you.

- ``secure`` flag:
  - When set, the ``secure`` attribute limits the scope of the cookie to be attached only to secure domains. This results in the cookie only being attached to requests transmitted over HTTPS. This prevents cookies theft via man in the middle attacks.

## Usage
The ``secure`` flag can be toggled by the ``cookieSecure`` attribute in the Session recipe config in your backend code.

### Config for Nodejs
<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let SuperTokens = require("supertokens-node");
let Session = require("supertokens-node/recipe/session");

SuperTokens.init({
    supertokens: {...},
    appInfo: {...},
    recipeList: [
        Session.init({
            cookieSecure: true | false;
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->
