---
id: usage
title: How to use
hide_title: true
---

# How to use

## Use the override config: [API Reference](/docs/nodejs/thirdparty/override/functions)

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        ThirdParty.init({
__HIGHLIGHT__            override: {
                functions: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signInUp: async (input) => {
                            // TODO: some custom logic

                            // or call the default behaviour as show below
                            return await originalImplementation.signInUp(input);
                        },
                        // ...
                        // TODO: override thirdparty functions here
                    }
                },
                emailVerificationFeature: {
                    functions: (originalImplementationEmailVerification) => {
                        return {
                            ...originalImplementationEmailVerification,
                            isEmailVerified: async (input) => {
                                // TODO: some custom logic

                                // or call the default behaviour as show below
                                return await originalImplementationEmailVerification.isEmailVerified(input);
                            },
                            // ...
                            // TODO: override emailverification functions here
                        }
                    }
                }
            } __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `originalImplementation` and `originalImplementationEmailVerification` are objects that contains functions that have the original implementaion for this and the email verification recipe. They can be used in your functions as a way to use the SuperTokens' default behaviour.
- In the above code snippet, we override the `signInUp` function of this recipe. This function will be used to handle the scenario where a user either sign-up or sign-in via any third party provider, e.g. Google and is supposed to return a User object as mentioned [here](https://github.com/supertokens/core-driver-interface/wiki#third-party-user).
- Likewise, we override the `isEmailVerified` function for the email verification recipe. The function will be given an email address in input body and is supposed to return a boolean determining if the email is verified or not.