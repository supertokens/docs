---
id: version-0.4.X-sign-up
title: Sign up form config
hide_title: true
original_id: sign-up
---

# Sign up Form reference API

Example of a fully customized "EmailPassword" configuration for the Sign-up form.

```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
            palette: {...},
            signInAndUpFeature: {
                signUpForm: {
                    privacyPolicyLink: "https://supertokens.com/legal/privacy-policy",
                    termsAndConditionsLink: "https://supertokens.com/legal/terms-and-conditions",
                    style: {
                        container: {
                            backgroundColor: "#ffeeff"
                        },
                        (...)
                    },
                    formFields: [{
                        id: "age",
                        label: "Your age",
                        placeholder: "How old are you?",
                        validate: async (value) => {
                            // Custom validation
                        }
                    },{
                        id: "name",
                        label: "Full name",
                        placeholder: "First name followed by last name"
                        optional: true
                    }]
                }
            },
            (...)
        })
    ]
});
```

## `signUpForm` Config values

- **privacyPolicyLink**: 
    - Description: Link to your privacy policy
    - Example: ```privacyPolicyLink: "https://supertokens.com/legal/privacy-policy"```
    - Optional

- **termsAndConditionsLink**: 
    - Description: Link to your terms and conditions
    - Example: ```termsAndConditionsLink: "https://supertokens.com/legal/terms-and-conditions"```

- **style**: 
    - Description: An object to overwrite the Sign up form styles. Please refer to the <a href="/docs/emailpassword/common-customizations/styling/changing-style" target="_blank">common custimizations guide</a> for more information about how to update the sign up form style.
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
    - Description: Array that lets you overwrite the default email/password fields labels, placeholder and validation methods, as well as defining new fields.
    - Example: 
        -
        ```js
            formFields: [{
                id: "age",
                label: "Your age",
                placeholder: "How old are you?",
                validate: async (value) => {
                    // Custom validation
                }
            },{
                id: "name",
                label: "Full name",
                placeholder: "First name followed by last name"
                optional: true
            }]
        ```
    - Fields:
        - **id**
            - Type: `string`
            - Description: Id of the form field.
            - Example: "email" | "password"
        - **label**
            - Type: `string`
            - Description: Label that will be displayed in the sign up form above the input field.
            - Example: "Work Email"
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
            - Example: Please refer to the <a href="/docs/emailpassword/common-customizations/signup-form/field-validators" target="_blank">common custimizations guide</a> for an example of how to use `validate` methods.
            - Optional
        - **optional**
            - Type: boolean
            - Description: Set to `true` if you want to make the field optional. 
            - Default: `false`
            - Optional

<div class="specialNote" style="margin-bottom: 40px">
Note that the email validator that you define for Sign up is also applied automatically to Sign In.
Similarly, the password validator that you define for Sign up is also applied automatically to reset password forms.
</div>

If you would like more information about the default email/password validators, or if you would like to see an example of how to overwrite the field validators, please refer to the  <a href="/docs/emailpassword/common-customizations/signup-form/field-validators" target="_blank">common custimizations guide</a>.
