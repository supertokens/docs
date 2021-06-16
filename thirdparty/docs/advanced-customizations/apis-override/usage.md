---
id: usage
title: How to use
hide_title: true
---

# How to use

## Use the override config: [API Reference](/docs/nodejs/thirdparty/override/apis)

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        ThirdParty.init({
__HIGHLIGHT__            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signInUpPOST: async (input) => {
                            // TODO: some custom logic

                            // or call the default behaviour as show below
                            return await originalImplementation.signInUpPOST(input);
                        },
                        // ...
                        // TODO: override thirdparty apis here
                    }
                },
                emailVerificationFeature: {
                    apis: (originalImplementationEmailVerification) => {
                        return {
                            ...originalImplementationEmailVerification,
                            verifyEmailPOST: async (input) => {
                                // TODO: some custom logic

                                // or call the default behaviour as show below
                                return await originalImplementationEmailVerification.verifyEmailPOST(input);
                            },
                            // ...
                            // TODO: override emailverification apis here
                        }
                    }
                }
            } __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `originalImplementation` and `originalImplementationEmailVerification` are objects that contains apis that have the original implementaion for this and the email verification recipe. They can be used in your apis as a way to use the SuperTokens' default behaviour.
- In the above code snippet, we override the `signInUpPOST` api of this recipe. This api will be used to handle the signInUp API route when a user either sign-up or sign-in.
- Likewise, we override the `verifyEmailPOST` api for the email verification recipe.