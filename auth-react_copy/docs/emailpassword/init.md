---
id: init
title: Init
hide_title: true
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
            useShadowDom: true,
            signInAndUpFeature: {
                disableDefaultImplementation: false,
                defaultToSignUp: true,
                signUpForm: {...},
                signInForm: {...}
            },
            resetPasswordUsingTokenFeature: {
                disableDefaultImplementation: false
                enterEmailForm: {...}
                submitNewPasswordForm: {...}
            },
            emailVerificationFeature: {
                disableDefaultImplementation: false
                mode: "OFF",
                sendVerifyEmailScreen: {...},
                verifyEmailLinkClickedScreen: {...}
            },
            preAPIHooks(context) {}
            getRedirectionURL(context) {}
            onHandleEvent(context) {}
        })
    ]
});
```

## Config values

- **palette**:
    - Description: The palette allows you to customize basic colours of the Sign-up / Sign-in / Reset Password forms. Read the [common customizations guide](/docs/emailpassword/common-customizations/styling/changing-colours) for more information about the palette.

- **useShadowDom**:
    - Description: Styling encapsulation relies on <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM" target="_blank" rel="noreferer noopener">shadow DOM browser feature</a>. Unfortunately password managers such as Dashlane, LastPass, OnePassword, etc... do not detect authentication forms fields inside shadow DOMs. If you would like to make sure that your end users can use their password managers, you will have to disable shadow DOM. 
    - Default: ```"false"```
    - Example: ```useShadowDom: "true"```


<div class="specialNote" style="margin-bottom: 20px">

- SuperTokens uses only randomized styles to define its styling so disabling shadow DOM  should not impact the rest of your application's styles. On the other hand, when disabling Shadow DOM, make sure to verify that your CSS does not impact how SuperTokens UI is rendered.
- Shadow DOM will always be disabled with Internet Explorer since it does not support it. Similarly, if you intend to support Internet Explorer for your application make sure to verify how SuperTokens UI is rendered.
</div>


### signInAndUpFeature

- **disableDefaultImplementation**: 
    - Description: When true, the default route (`/auth`) for Sign-up / Sign-in is disabled.
    - Default: ```"false"```
    - Example: ```disableDefaultImplementation: "true"```

- **defaultToSignUp**: 
    - Description: When disabled, the Sign-up / Sign-in widget will display the Sign-In widget by default.
    - Default: ```"true"```
    - Example: ```defaultToSignUp: "false"```


- **signUpForm**:
    - Description: The `signUpForm` configuration allows you to update styles, create new Sign up fields, add custom validators. More information in the corresponding [sign up section](./config/sign-up)

- **signInForm**:
    - Description: The `signInForm` configuration allows you to update styles, customize "email"|"password" fields, add custom validators. More information in the corresponding [sign in section](./config/sign-in)


### resetPasswordUsingTokenFeature

- **disableDefaultImplementation**: 
    - Description: When true, the default route (`/auth/reset-password`) for reset password is disabled.
    - Default: ```"false"```
    - Example: ```disableDefaultImplementation: "true"```

- **enterEmailForm**:
    - Description: The `enterEmailForm` configuration allows you to update styles. More information in the corresponding [reset password email section](./config/reset-password#enteremailform-config-values)

- **submitNewPasswordForm**:
    - Description: The `submitNewPasswordForm` configuration allows you to update styles. More information in the corresponding [reset password new password section](./config/reset-password#submitnewpasswordform-config-values)

### emailVerificationFeature

- **disableDefaultImplementation**: 
    - Description: When true, the default route (`/auth/verify-email`) for reset password is disabled.
    - Default: ```"false"```
    - Example: ```disableDefaultImplementation: "true"```

- **mode**:
    - Description: Email verification mode.
    - Default: ```"OFF"```
    - Example: ```mode: "REQUIRED"```

- **sendVerifyEmailScreen**:
    - Description: The `sendVerifyEmailScreen` configuration allows you to update styles. More information in the corresponding [email verification section](./config/email-verification#sendverifyemailscreen-config-values)

- **verifyEmailLinkClickedScreen**:
    - Description: The `verifyEmailLinkClickedScreen` configuration allows you to update styles. More information in the corresponding [email verification section](./config/email-verification#verifyemaillinkclickedscreen-config-values)


## Hooks

### preAPIHooks

Description: This async method can be used to update the request object sent to your API regarding authentication. See [callbacks documentation](./callbacks#preapihooks) for more information.

### getRedirectionURL

Description: This async method can be used to update the redirection rules for specific paths. See [callbacks documentation](./callbacks#getredirectionurl) for more information.

### onHandleEvent

Description: This method can be used to store analytics to your system on key events happening during authentication. See [callbacks documentation](./callbacks#onhandleevent) for more information.
