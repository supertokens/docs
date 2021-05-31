---
id: adding-fields
title: Adding Extra Fields
hide_title: true
---

# Adding Extra Fields 💥

## Step 1: Front End 🚪

Currently, your Sign-up form contains only email and password fields.
But you might want to get more information from your customers on sign up.
Let's see how you can extend the Sign-up form to fit your needs.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            signInAndUpFeature: {
                signUpForm: {
__HIGHLIGHT__                    formFields: [{
                        id: "name",
                        label: "Full name",
                        placeholder: "First name and last name"
                    }, {
                        id: "age",
                        label: "Your age",
                        placeholder: "How old are you?",
                    }, {
                        id: "country",
                        label: "Your country",
                        placeholder: "Where do you live?",
                        optional: true
                    }]
                } __END_HIGHLIGHT__
            }
        }),
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

<img src="/docs/static/assets/thirdpartyemailpassword/signup-with-name-and-age.png" />

Please refer to the <a href="../../../auth-react/emailpassword/config/sign-up#signupform-config-values" target="_blank">auth-react reference API</a>  for more information about adding custom fields.

## Step 2: Back End 📫

### Add fields to SuperTokens `init`
Now that you have added new fields to the front end you need to make sure that the backend will take them into account when your new users register.

Go back to where you have called the SuperTokens init function in your NodeJs application:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            signUpFeature: {
__HIGHLIGHT__                formFields: [{
                  id: "name"
                }, {
                  id: "age"
                }, {
                  id: "country",
                  optional: true
                }] __END_HIGHLIGHT__
            }
        }),
        Session.init({...})
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

### Handle form fields on successful Sign-up

SuperTokens does not store those custom fields on successful signup. 

Instead, you should use the `handlePostSignUp` callback to handle those values yourselves.

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
                  id: "age"
                }, {
                  id: "country",
                  optional: true
                }],
__HIGHLIGHT__                handlePostSignUp: async (user, context) => {
                    let {id, email} = user;
                    if (context.loginType === "emailpassword") {
                        let formFields = context.formFields;
                        // TODO...
                    } else {
                        let thirdPartyAuthCodeResponse = context.thirdPartyAuthCodeResponse;
                        /* thirdPartyAuthCodeResponse is the response from the third party login provider that contains the access / refresh tokens sent by them..*/
                    }
                } __END_HIGHLIGHT__
            } 
        }),
        Session.init({...})
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

<div class="specialNote" style="margin-bottom: 40px">
Please note that Supertokens is not applying any processing to those custom fields. That means you should sanitize all the fields.
</div>

