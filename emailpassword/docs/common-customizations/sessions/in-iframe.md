---
id: in-iframe
title: Using in an iframe
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./session/docs/common-customizations/sessions/in-iframe.md -->

# Using in an iframe

If your website can be embedded in an iframe which is consumed by other websites, then this section is for you. 

> If the sites in which your iframe can be embedded share the same top level domain as the iframe domain, then you can ignore this section.

## Frontend changes

- Set `isInIframe` to `true` during `Session.init` on the frontend.
- You will need to use `https` during testing / dev for this to work. You can use tools like [ngrok](https://ngrok.com/) to create a dev env with https on your website / API domain. 

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js

SuperTokens.init({
    appInfo: {...},
    recipeList: [
        Session.init({
__HIGHLIGHT__            isInIframe: true __END_HIGHLIGHT__
        })
    ]
});

```
<!--END_DOCUSAURUS_CODE_TABS-->

## Backend changes

> Make the changes below only if your CORS setting allows any origin to query your API. Ignore these backend changes if your iframe is only allowed to work within certain trusted sites (and you have whitelisted them via the allowed origins config in your CORS setting).

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js

SuperTokens.init({
    appInfo: {...},
    recipeList: [
        Session.init({
__HIGHLIGHT__            cookieSameSite: "none",
            antiCsrf: "VIA_TOKEN" __END_HIGHLIGHT__
        })
    ]
});

```
<!--END_DOCUSAURUS_CODE_TABS-->

## A note on Safari and Chrome (Incognito mode only)

The default behaviour for these is that third party cookies / localstorage are blocked. This means that sessions will not work, and we should instead show the user instructions on how to enable them (depending on their browser).

Once enabled, sessions will work as expected.

This is [an open issue](https://github.com/supertokens/supertokens-core/issues/242).
