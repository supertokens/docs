---
id: disabling
title: Disabling APIs
hide_title: true
---

# Disabling APIs

To disable the API handling entirely from Supertokens SDK, all you need to do is override the api implementation as undefined. For example, if you want to disable sign-up / sign-in api from EmailPassword recipe, all you do is this:

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        EmailPassword.init({
__HIGHLIGHT__            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signUpPOST: undefined,
                        signInPOST: undefined
                    }
                }
            } __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->
