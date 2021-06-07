---
id: version-0.7.X-reset-password
title: Reset Password
hide_title: true
original_id: reset-password
---

# Reset password Forms reference API

Example of a fully customized "EmailPassword" configuration for the reset password forms.

```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
            palette: {...},
            resetPasswordUsingTokenFeature: {
                enterEmailForm: {
                    style: {
                        container: {
                            backgroundColor: "#ffeeff"
                        },
                        (...)
                    }
                },
                submitNewPasswordForm: {
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

# `enterEmailForm` Config values

- **style**: 
    - Description: An object to overwrite the Sign up form styles. Please refer to the <a href="/docs/emailpassword/common-customizations/styling/changing-style" target="_blank">common customizations guide</a> for more information about how to update the enter email form style.
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

# `submitNewPasswordForm` Config values

- **style**: 
    - Description: An object to overwrite the submit new password form styles. Please refer to the  <a href="/docs/emailpassword/common-customizations/styling/changing-style" target="_blank">common customizations guide</a> for more information about how to update the sign up form style.
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
