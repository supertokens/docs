---
id: anti-csrf
title: Anti CSRF
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./session/common-customizations/sessions/anti-csrf.md -->

# Anti CSRF

## CSRF Attack

An example of a CSRF attack would be if an attacker wants to change the victim's password to a website they are logged into. The attacker could construct and direct the victim to a fake webpage which would trigger a request to the "reset password API" of the website. Since the user was logged in, the browser would automatically attach the session cookies to the request. This would allow the attacker to reset a user's password if they knew the user's email address, the API structure, and the ``sameSite`` attribute is set to ``none``.


## Relation with ``sameSite`` cookie attribute
The ``sameSite`` cookie attribute is used to declare if your cookies should be restricted to a first-party or same-site context. Properly configuring ``sameSite`` can prevent CSRF attacks.


> SuperTokens automatically defends against CSRF attacks using the ``sameSite`` attribute, so the ``anti-csrf`` feature is disabled by default. In case the ``sameSite`` attribute is set to ``none`` , then the ``anti-csrf`` feature is enabled automatically. If you do not set the sameSite attribute explicitly, it will be determined based on your provided `apiDomain` and `websiteDomain` values.

## Manually enable anti-csrf
You can manually enable anti-csrf value when configuring the Session recipe in your backend code:
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
__HIGHLIGHT__             antiCsrf: "NONE" | "VIA_CUSTOM_HEADER" | "VIA_TOKEN"; __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- A value of `"NONE"` would disable any anti-csrf protection from our end. You can use this if you have your implementation of CSRF protection.
- A value of `"VIA_CUSTOM_HEADER"` uses [this method](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#use-of-custom-request-headers) to prevent CSRF protection. This is set automatically if `sameSite` is `none` or if your `apiDomain` and `websiteDomain` do not share the same top level domain name. If this is used, please carefully set CORS rules on the backend - **make sure you explicitly set a list of allowed origins**.
- A value of `"VIA_TOKEN"` uses an explicit anti-csrf token. Use this method if you want to allow any origin to query your APIs. This method may cause issues in browsers like Safari, especially if your site is embedded as an `iframe`.
