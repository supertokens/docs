---
id: about
title: Enable email verification
hide_title: true
---

# Enable email verification

Email verification is turned off by default. It is strongly encouraged to enable it to ensure the authenticity of your users

Here is how to turn on email verification from your front end application:

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
__HIGHLIGHT__            emailVerificationFeature: {
                mode: "REQUIRED"
            }
        }), __END_HIGHLIGHT__
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

When a new user sign up, they will receive an email to verify their address and be redirected to the following screen:

<img width="700px" src="/docs/static/assets/emailpassword/verify-email-screen.png" />

After they have clicked on the email, they will see this screen:

<img width="700px" src="/docs/static/assets/emailpassword/email-verification-successful.png" />

## Doing operations post email verification

We have defined a callback in the backend SDK which will be called after a successful email verification. You can define the callback for tasks like analytics, sending a user a welcome email, notifying an internal dashboard etc..

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
            emailVerificationFeature: {
__HIGHLIGHT__                handlePostEmailVerification: (user) => {
                  let {id, email} = user;
                  // this is called when this user verifies their email.
                } __END_HIGHLIGHT__
            }
        }),

        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

<div class="specialNote" style="margin-bottom: 40px">
Note that if you are already using SuperTokens in production and turn on email verification, your users will be redirected to the email verification screen next time they use your application.
</div>