---
id: version-0.7.X-email-verification
title: Email Verification
hide_title: true
original_id: email-verification
---

# Email Verification Forms reference API

Example of a fully customized "ThirdPartyEmailPassword" configuration for the email verification forms.

```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            palette: {...},
            emailVerificationFeature: {
                sendVerifyEmailScreen: {
                    style: {
                        container: {
                            backgroundColor: "#ffeeff"
                        },
                        (...)
                    }
                },
                verifyEmailLinkClickedScreen: {
                    style: {
                        container: {
                            backgroundColor: "#ffeeff"
                        },
                        (...)
                    }
                }
            },
            (...)
        })
    ]
});
```

# `sendVerifyEmailScreen` Config values

- **style**: 
    - Description: An object to overwrite the verify email form styles. Please refer to the <a href="/docs/thirdpartyemailpassword/common-customizations/styling/changing-style" target="_blank">common customizations guide</a> for more information about how to update the enter email form style.
    - Example: 
        -
        ```js
            style: {
                container: {
                    marginLeft: "10px",
                    (...)
                },
                link: {
                    color: "orange"
                }
                (...)
            }
        ```

# `verifyEmailLinkClickedScreen` Config values

- **style**: 
    - Description: An object to overwrite the submit new password form styles. Please refer to the  <a href="/docs/thirdpartyemailpassword/common-customizations/styling/changing-style" target="_blank">common customizations guide</a> for more information about how to update the sign up form style.
    - Example: 
        -
        ```js
            style: {
                container: {
                    marginLeft: "10px",
                    (...)
                },
                link: {
                    color: "orange"
                }
                (...)
            }
        ```
