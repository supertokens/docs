---
id: same-site-cookie
title: Same site cookies
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./session/common-customizations/sessions/same-site-cookie.md -->

# Same site cookies

> SuperTokens will automatically set the value of the ``sameSite`` cookie attribute based on your website and api domain configration.

To ensure session cookies are protected from [CSRF attacks](./anti-csrf.md#csrf-attack) the ``sameSite`` cookie attribute is set.

The ``sameSite`` cookie attribute is used to declare if your cookies should be restricted to a first-party or same-site context.
The ``sameSite`` attribute can be set to three possible values:
- ``none``
  - Cookies will be sent in all contexts, i.e cookies will be attached to both first-party and cross-origin requests

- ``lax``
  - Cookies will only be sent in a first-party context and along with GET requests initiated by third party websites. It is important to note that in the second case, to send a cookie with a GET request initiated by third party website, the GET request must be made by top level navigation(user clicking on a link).
  
- ``strict``
  - Cookies will only be sent in a first-party context and not be sent along with requests initiated by third party websites.

## Manually set ``sameSite`` value
You can manually set the ``sameSite`` value when configuring the Session recipe in your backend code:

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
__HIGHLIGHT__            cookieSameSite: "strict" | "lax" | "none"; __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->
