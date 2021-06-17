---
id: version-0.14.X-init
title: Init
hide_title: true
original_id: init
---

# Session `init`

To start using the "Session" recipe for session management, start by importing the `Session` module from the library and add it to the `recipeList`:

```js
import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    appInfo: {...},
__HIGHLIGHT__    recipeList: [
        Session.init({...})
    ] __END_HIGHLIGHT__
});
```

> Learn more about the various config values [here](/docs/website/api-reference). All config values except for `apiDomain` and `apiBasePath` are applicable.