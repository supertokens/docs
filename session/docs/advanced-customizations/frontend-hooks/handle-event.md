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
Session.init({
    onHandleEvent: (context) => {
        if (context.action === "SIGN_OUT") {
            // called when the user clicks on sign out
        } else if (context.action === "REFRESH_SESSION") {
            // called with refreshing a session
            // NOTE: This is an undeterministic event
        } else if (context.action === "UNAUTHORISED") {
            // called when the session has expired
        }
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->
