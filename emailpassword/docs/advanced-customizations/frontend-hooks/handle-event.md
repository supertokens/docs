---
id: handle-event
title: Handle Event Hook
hide_title: true
---

# Handle Event Hook

This function is called for various user actions. It can be used for logging, analytics or any side effect purposes (these are essentially fire and forget events).

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
EmailPassword.init({
    onHandleEvent: (context) => {
        if (context.action === "EMAIL_VERIFIED_SUCCESSFUL") {

        } else if (context.action === "PASSWORD_RESET_SUCCESSFUL") {

        } else if (context.action === "RESET_PASSWORD_EMAIL_SENT") {

        } else if (context.action === "SESSION_ALREADY_EXISTS") {
            // called when a user visits the login / sign up page with a valid session
            // in this case, they are usually redirected to the main app
        } else if (context.action === "SUCCESS") {
            let user = context.user;
            if (context.isNewUser) {
                // sign up success
            } else {
                // sign in success
            }
        } else if (context.action === "VERIFY_EMAIL_SENT") {

        }
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Also checkout the [session recipe hand event hook](/docs/session/advanced-customizations/frontend-hooks/handle-event).
