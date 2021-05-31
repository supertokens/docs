---
id: version-0.7.X-sign-in
title: Sign In form config
hide_title: true
original_id: sign-in
---

# Sign in Form reference API

Here is an example of a fully customized "ThirdPartyEmailPassword" configuration for the Sign-in form.

```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            palette: {...},
            signInAndUpFeature: {
                signInForm: {
                    formFields: [{
                        id: "email",
                        label: "Your email",
                        placeholder: "Enter your email",
                        validate: async (value) => {
                            // Custom validation
                        }
                    },{
                        id: "password",
                        label: "Password",
                        placeholder: "Enter your password"
                    }]
                }
            },
            (...)
        })
    ]
});
```

# `signInForm` Config values

- **style**: 
    - Description: An object to overwrite the Sign up form styles. Please refer to the <a href="/docs/thirdpartyemailpassword/common-customizations/styling/changing-style" target="_blank">common customizations guide</a> on how to update the sign in form style.
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


- **formFields**: 
    - Description: This is an array that lets you overwrite the default email/password fields labels, placeholder and validation methods.
    - Example: 
        -
        ```js
            formFields: [{
                id: "email",
                label: "Your email",
                placeholder: "Enter your email",
                validate: async (value) => {
                    // Custom validation
                }
            },{
                id: "password",
                label: "Password",
                placeholder: "Enter your password"
            }]
        ```
    - Fields:
        - **id**
            - Type: `string`
            - Description: Id of the form field.
            - Example: "email" | "password"
            - Required
        - **label**
            - Type: `string`
            - Description: Label that will be displayed in the sign up form above the input field.
            - Example: "Work Email"
            - Required
        - **placeholder**
            - Type: string
            - Description: Placeholder that will be displayed in the sign up inputs before the user types in.
            - Example: "Enter your work email",
            - Default: Equal to corresponding label.
            - Optional
        - **validate**
            - Input:
                - value: any
            - Output:
                - Promise:
                    - `string`: Return an error string when validation fails.
                    - `undefined`: Return `undefined` when there are no errors.
            - Description: If your field requires a front end validation, you can define a `validate` method that will be called when the user clicks on the Sign up button.
            - Example: Please refer to the <a href="/docs/emailpassword/common-customizations/signup-form/field-validators" target="_blank">common customizations guide</a>
              for an example of how to use `validate` methods.
            - Optional
        - **optional**
            - Type: boolean
            - Description: Set to `true` if you want to make the field optional. 
            - Example: "Enter your work email"
            - Default: `false`
            - Optional

<div class="specialNote" style="margin-bottom: 40px">
Note that the email validator that you define for Sign up is also applied automatically to Sign In.
Similarly, the password validator that you define for Sign up is also applied automatically to reset password forms.
</div>
