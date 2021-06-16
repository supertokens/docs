---
id: usage
title: How to use
hide_title: true
---

# How to use

## Use the override config: [API Reference](/docs/nodejs/session/override/functions)

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        Session.init({
__HIGHLIGHT__            override: {
                functions: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        createNewSession: async (input) => {
                            // TODO: some custom logic

                            // or call the default behaviour as show below
                            return await originalImplementation.createNewSession(input);
                        },
                        // ...
                        // TODO: override more functions
                    }
                }
            } __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `originalImplementation` is the object that contains functions that have the original implementaion for this recipe. It can be used in your functions as a way to use the SuperTokens' default behaviour.
- In the above code snippet, we override the `createNewSession` function of this recipe. This can be used to (for example) modifying the session payload when a new session is created.