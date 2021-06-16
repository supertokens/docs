---
id: usage
title: How to use
hide_title: true
---

# How to use

## Use the override config: [API Reference](/docs/nodejs/session/override/apis)

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        Session.init({
__HIGHLIGHT__            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        refreshPOST: async (input) => {
                            // TODO: some custom logic

                            // or call the default behaviour as show below
                            return await originalImplementation.refreshPOST(input);
                        },
                        // ...
                        // TODO: override more apis
                    }
                }
            } __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `originalImplementation` is the object that contains apis that have the original implementation for this recipe. It can be used in your apis as a way to use the SuperTokens' default behaviour.
- In the above code snippet, we override the `refreshPOST` api of this recipe. This api will be used to handle the refreshPost API route where a session is refreshed.