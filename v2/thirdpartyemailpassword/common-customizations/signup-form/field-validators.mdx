---
id: field-validators
title: Adding / Modifying field validators
hide_title: true
---

# Adding / Modifying field validators ✅


## Step 1: Front End 🚪


Now that you have added new fields to your signup form, let's see how you can add validators to make sure that your users provide the right information.

You can add a `validate` method to any `formFields`.

Building up on our [previous example](./adding-fields), let's add an age verification to our form:

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            signInAndUpFeature: {
                signUpForm: {
                    formFields: [{
                        id: "name",
                        label: "Full name",
                        placeholder: "First name and last name"
                    }, {
                        id: "age",
                        label: "Your age",
                        placeholder: "How old are you?",
                        optional: true,

                        /* Validation method to make sure that age is above 18 */
__HIGHLIGHT__                        validate: async (value) => {
                            if (parseInt(value) > 18) {
                                return undefined; // means that there is no error
                            }
                            return "You must be over 18 to register";
                        } __END_HIGHLIGHT__

                    }, {
                        id: "country",
                        label: "Your country",
                        placeholder: "Where do you live?",
                        optional: true
                    }]
                }
            }
        }),
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Here is what happens if someone tries to register with an age of 17:

<img src="/docs/static/assets/thirdpartyemailpassword/signup-invalid-age-light.png" />

<div class="specialNote" style="margin-bottom: 40px">
Front-end validation is great for user experience but you should always make sure that you are also applying a backend validation for security reasons.
</div>

## Step 2: Back End 📫

In your NodeJS SuperTokens init method, let's copy the validate from above:
<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            signUpFeature: {
                formFields: [{
                  id: "name"
                }, {
                    id: "age",
                    /* Validation method to make sure that age >= 18 */
__HIGHLIGHT__                    validate: async (value) => {
                        if (parseInt(value) >= 18) {
                            return undefined; // means that there is no error
                        }
                        return "You must be over 18 to register";
                    } __END_HIGHLIGHT__
                }, {
                  id: "country",
                  optional: true
                }]
            }
        }),
        Session.init({
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

# Changing the email and password validators ✅

By default, SuperTokens adds an email and a password validator to the sign-up form.

The default email validator makes sure that the provided email is in the correct email format. **It is strongly encouraged to keep it as is.**

The default password validator makes sure that the provided password:
  - has a minimum of 8 characters.
  - contains at least one lowercase character
  - contains at least one number

<div class="specialNote" style="margin-bottom: 40px">
The email validator that you define for Sign up is also applied automatically to Sign In.

The password validator that you define for Sign up is also applied automatically to reset password forms.
</div>

## Overwriting the default validators

### Step 1: Front End 🚪
<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            signInAndUpFeature: {
                signUpForm: {
                    formFields: [{
__HIGHLIGHT__                        id: "email",
                        validate: async (value) => {
                            // Your own validation returning a string or undefined if no errors.
                        } __END_HIGHLIGHT__
                    },{
__HIGHLIGHT__                        id: "password",
                        validate: async (value) => {
                            // Your own validation returning a string or undefined if no errors.
                        } __END_HIGHLIGHT__
                    }]
                }
            }
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

### Step 2: Back End 📫

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            signUpFeature: {
                formFields: [{
__HIGHLIGHT__                    id: "email",
                    validate: async (value) => {
                        // Your own validation returning a string or undefined if no errors.
                    } __END_HIGHLIGHT__
                }, {
__HIGHLIGHT__                    id: "password",
                    validate: async (value) => {
                        // Your own validation returning a string or undefined if n __END_HIGHLIGHT__o errors.
                    }
                }]
            }
        }),
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->