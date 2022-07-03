---
id: sign-in-and-up
title: Sign In And Up
hide_title: true
---

# Sign in and up configs

Here is an example of a fully customized "ThirdParty" configuration for the Sign-in / Sign-up form.

```js
import SuperTokens from "supertokens-auth-react";
import ThirdParty, {Google, Facebook, Github} from "supertokens-auth-react/recipe/thirparty";
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdParty.init({
            signInAndUpFeature: {
                disableDefaultImplementation: false,
                privacyPolicyLink: "https://supertokens.com/legal/privacy-policy",
                termsAndConditionsLink: "https://supertokens.com/legal/terms-and-conditions",
                style: {
                    container: {
                        backgroundColor: "#ffeeff"
                    },
                    providerGoogle: {
                        color: "red"
                    }
                    (...)
                },
                providers: [
                    Google.init(),
                    Facebook.init(),
                    Github.init(),
                    {
                        id: "custom",
                        name: "Custom provider",
                        buttonComponent: () => <div>Sign In with this custom provider</div> // optional
                    }
                ]
            },
        })
    ]
});
```

## `signInAndUpForm` Config values

- **disableDefaultImplementation**: 
    - Description: When true, the default route (`/auth`) for Sign-up is disabled.
    - Default: ```"false"```
    - Example: ```disableDefaultImplementation: "true"```

- **privacyPolicyLink**: 
    - Description: Link to your privacy policy
    - Example: ```privacyPolicyLink: "https://supertokens.com/legal/privacy-policy"```
    - Optional

- **termsAndConditionsLink**: 
    - Description: Link to your terms and conditions
    - Example: ```termsAndConditionsLink: "https://supertokens.com/legal/terms-and-conditions"```

- **style**: 
    - Description: An object to overwrite the Sign up form styles. Please refer to the <a href="/docs/thirdparty/common-customizations/styling/changing-style" target="_blank">common customizations guide</a> on how to update the sign in form style.
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
                },
                providerGoogle: {
                    color: "red"
                }
                (...)
            }
        ```

<div class="specialNote" style="margin-bottom: 40px">
    To overwrite the provider button, the style property should be "provider{name}". For example with google: `providerGoogle`. 
</div>


- **providers**: 
    - Description: This is an array that contains the third party providers.
    - Example: 
        -
        ```js
            providers: [
                Google.init(),
                Facebook.init({
                    buttonComponent: () => <div>Sign In with Facebook custom button</div> // optional
                }),
                {
                    id: "custom", // required
                    name: "Custom", // required
                    buttonComponent: () => <div>Sign In with this custom provider</div> // optional
                }
            ]
        ```
    - providers:
        - Built in: Ex `Google.init({...}) | Facebook.init({...}` 

            - **buttonComponent**
                - Type: `JSX.Element`
                - Description: Button component that will be rendered in place of the default button.
                - Example: `() => <div>Sign In with this Gmail</div>`
                - Optional

        - Custom: Ex `{...}`

            - **id**
                - Type: `string`
                - Description: Id of the provider. It will be used to build the auth callback route `/auth/callback/google`
                - Example: `"google" | "facebook" | "twitch" | "slack"`
                - Required
            - **name**
                - Type: `string`
                - Description: Name of the provider. It will be used to build the button component `Continue with {name}` if no button component is provided.
                - Example: `"Google" | "Facebook" | "Twitch" | "Slack"`
                - Required
            - **buttonComponent**
                - Type: `JSX.Element`
                - Description: Button component that will be rendered in place of the default button.
                - Example: `() => <div>Sign In with this custom provider</div>`
                - Optional

