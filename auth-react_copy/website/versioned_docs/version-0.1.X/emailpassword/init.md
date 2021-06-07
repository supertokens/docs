---
id: version-0.1.X-init
title: Init
hide_title: true
original_id: init
---

# EmailPassword `init`

To start using the "EmailPassword" recipe for Sign-up / Sign-in, start by importing the `EmailPassword` module from the library and add it to the `recipeList`:

```js
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";

SuperTokens.init({
    appInfo: {...},
__HIGHLIGHT__    recipeList: [
        EmailPassword.init()
    ] __END_HIGHLIGHT__
});
```

You can customize the `EmailPassword` module by overwriting the following configs:



Here is an example of a fully customized "EmailPassword" configuration. Make sure to only include the ones that you want to customize.

```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
            palette: {...},
            signInAndUpFeature: {
                onSuccessRedirectURL: '/',
                disableDefaultImplementation: false,
                signUpForm: {...},
                signInForm: {...}
            },
            resetPasswordUsingTokenFeature: {
                disableDefaultImplementation: false
                enterEmailForm: {...}
                submitNewPasswordForm: {...}
            }
        })
    ]
});
```

## Config values

- **palette**:
    - Description: The palette allows you to customize basic colours of the Sign-up / Sign-in / Reset Password forms. Read the [common customizations guide](/docs/emailpassword/common-customizations/styling/changing-colours) for more information about the palette.


### signInAndUpFeature

- **onSuccessRedirectURL**: 
    - Description: SuperTokens will redirect to this URL on successful signin or signout. This should be the entry point for your application.
    - Default: ```"/"```
    - Example: ```onSuccessRedirectURL: "/dashboard"```

- **disableDefaultImplementation**: 
    - Description: When true, the default route (`/auth`) for Sign-up / Sign-in is disabled.
    - Default: ```"false"```
    - Example: ```disableDefaultImplementation: "true"```

- **signUpForm**:
    - Description: The signUpForm configuration allows you to update styles, create new Sign up fields, add custom validators. More information in the corresponding [sign up section](./config/sign-up)

- **signInForm**:
    - Description: The `signInForm` configuration allows you to update styles, customize "email"|"password" fields, add custom validators. More information in the corresponding [sign in section](./config/sign-in)


### resetPasswordUsingTokenFeature

- **disableDefaultImplementation**: 
    - Description: When true, the default route (`/auth/reset-password`) for reset password is disabled.
    - Default: ```"false"```
    - Example: ```disableDefaultImplementation: "true"```

- **enterEmailForm**:
    - Description: The signUpForm configuration allows you to update styles. More information in the corresponding [reset password email section](./config/reset-password#enteremailform-config-values)

- **submitNewPasswordForm**:
    - Description: The signUpForm configuration allows you to update styles. More information in the corresponding [reset password new password section](./config/reset-password#submitnewpasswordform-config-values)