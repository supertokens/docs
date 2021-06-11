---
id: version-3.3.X-saas-setup
title: Managed Service
hide_title: true
original_id: saas-setup
---

<!-- COPY DOCS -->
<!-- ./community/docs/supertokens-core/saas-setup.md -->

# Managed Service

## Creating a development environment ✨
- First, please [sign up](/signup)
- Select a region and follow the guided steps until you see a dashboard like:
   <img width="500px" src="/docs/static/assets/emailpassword/saas-dev.png" />

# Connecting the backend SDK with SuperTokens 🔌
- Click on the blue "Connect" button, and you will see:
   <img width="400px" src="/docs/static/assets/emailpassword/saas-connect-popup.png" />
- The popup shows the `ConnectionURI` and the `apiKey`. These will go in the `supertokens` object in the `init` function on your backend:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->

```js
let supertokens = require("supertokens-node");

supertokens.init({
__HIGHLIGHT__    supertokens: {
      connectionURI: "<CONNECTION URI HERE FROM THE POPUP>",
      apiKey: "<API  KEY HERE FROM THE POPUP>"
   }, __END_HIGHLIGHT__
   appInfo: {...},
   recipeList: [...]
});
```

<!--END_DOCUSAURUS_CODE_TABS-->
