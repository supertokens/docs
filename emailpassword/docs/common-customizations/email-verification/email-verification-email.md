---
id: email-verification-email
title: Customising the email sent
hide_title: true
---


# Customising the email sent

## The default email
- From: no-reply@supertokens.io, but the user will see your app name
- Subject: `Email verification instructions`

<img style="margin-left: 0px" width="450px" src="/docs/static/assets/emailpassword/email-verify-email.png" />

## Send a custom email 🕶️

You can take full control of sending a password reset email by providing the `createAndSendCustomEmail` function during initialisation (on the backend):

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
supertokens.init({
    supertokens: {...},
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
__HIGHLIGHT__            emailVerificationFeature: {
                createAndSendCustomEmail: async (user, emailVerificationURLWithToken) => {
                    let {id, email} = user;
                    // TODO:
                }
            } __END_HIGHLIGHT__
        }),
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- You can get the user's email via the `user` input param.
- Your email must direct the user to open the `emailVerificationURLWithToken` link. This link is a full URL, with the email verification token. It points to the email verification page on your website (`/auth/email-verify` by default).
- Any errors thrown from this function will be ignored.
- **You must manage sending the email yourself if you provide this function**
