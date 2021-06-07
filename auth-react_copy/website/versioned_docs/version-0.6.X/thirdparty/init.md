---
id: version-0.6.X-init
title: Init
hide_title: true
original_id: init
---

# ThirdParty `init`

To start using the "ThirdParty" recipe for Sign-up / Sign-in, start by importing the `ThirdParty` module from the library and add it to the `recipeList`:

```js
import SuperTokens from "supertokens-auth-react";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";

SuperTokens.init({
    appInfo: {...},
__HIGHLIGHT__    recipeList: [
        ThirdParty.init()
    ] __END_HIGHLIGHT__
});
```

You can customize the `ThirdParty` module by overwriting the following configs:



Here is an example of a fully customized "ThirdParty" configuration. Make sure to only include the ones that you want to customize.

```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdParty.init({
            palette: {...},
            useShadowDom: true,
            signInAndUpFeature: {...},
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
    - Description: The palette allows you to customize basic colours of the Sign-up / Sign-in widgets. Read the [common custimizations guide](/docs/emailpassword/common-customizations/styling/changing-colours) for more information about the palette.

- **useShadowDom**:
    - Description: Styling encapsulation relies on <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM" target="_blank" rel="noreferer noopener">shadow DOM browser feature</a>. Unfortunately password managers such as Dashlane, LastPass, OnePassword, etc... do not detect authentication forms fields inside shadow DOMs. If you would like to make sure that your end users can use their password managers, you will have to disable shadow DOM. 
    - Default: ```"false"```
    - Example: ```useShadowDom: "true"```


<div class="specialNote" style="margin-bottom: 20px">

- SuperTokens uses only randomized styles to define its styling so disabling shadow DOM  should not impact the rest of your application's styles. On the other hand, when disabling Shadow DOM, make sure to verify that your CSS does not impact how SuperTokens UI is rendered.
- Shadow DOM will always be disabled with Internet Explorer since it does not support it. Similarly, if you intend to support Internet Explorer for your application make sure to verify how SuperTokens UI is rendered.
</div>


### signInAndUpFeature

Description: The `signInAndUpFeature` allows to configure third party providers. More information in the corresponding [sign in and up configs](./config/sign-in-and-up)

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
