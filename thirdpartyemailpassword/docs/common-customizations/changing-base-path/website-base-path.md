---
id: website-base-path
title: Website Base Path
hide_title: true
---

# Website Base Path
## Front End Change 🚪

Since the beginning of this guide, you probably noticed that all the front-end routes for SuperTokens widget are prefixed by `/auth`. You can change this value in the `init` function by setting `websiteBasePath`.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS--> 
```js
SuperTokens.init({
    appInfo: {
        appName: "yourAppName",
        apiDomain: "yourApi",
        websiteDomain: "yourWebsite",
__HIGHLIGHT__        websiteBasePath: "/authentication" __END_HIGHLIGHT__
    }
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Now, if you navigate to `/authentication`, you should see the widget.

<div class="specialNote" style="margin-bottom: 40px">
Beware that updating the websiteBasePath for the authentication widgets will also change the providers callbacks paths (ex "/auth/callback/google" => "/authentication/callback/google"). Make sure that you are correctly whitelisting redirect urls for each providers.
</div>

## Back End Change 📫

You also need to change the `websiteBasePath` in your backend code:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
SuperTokens.init({
    appInfo: {
        appName: "yourAppName",
        apiDomain: "yourApi",
        websiteDomain: "yourWebsite",
__HIGHLIGHT__        websiteBasePath: "/authentication" __END_HIGHLIGHT__
    }
});
```
<!--END_DOCUSAURUS_CODE_TABS-->