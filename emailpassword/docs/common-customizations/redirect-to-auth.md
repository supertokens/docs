---
id: redirect-to-auth
title: Redirect To Auth Screen
hide_title: true
---

# Redirect To Auth Screen

Use the `redirectToAuth(show?: "signin" | "signup")` function to redirect the user to the full page auth screen provided by SuperTokens.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->

```js
__HIGHLIGHT__ import { redirectToAuth } from "supertokens-auth-react/recipe/emailpassword"; __END_HIGHLIGHT__

function NavBar () {
  function async onLogin () {
__HIGHLIGHT__    redirectToAuth(); __END_HIGHLIGHT__
    // call redirectToAuth("signin") to take them to the sign in screen
    // call redirectToAuth("signup") to take them to the sign up screen
  }
  return (
    <ul>
         <li>Home</li>
         __HIGHLIGHT_PHRASE__ <li onClick={onLogin}>Login</li> __END_HIGHLIGHT_PHRASE__

    </ul>
  )
}
```

<!--END_DOCUSAURUS_CODE_TABS-->