---
id: redirect-to-auth
title: Redirect To Auth Screen
hide_title: true
---

# Redirect To Auth Screen

Use the `redirectToAuth()` function to redirect the user to the full page auth screen provided by SuperTokens.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->

```js
__HIGHLIGHT__ import { redirectToAuth } from "supertokens-auth-react/recipe/thirdparty"; __END_HIGHLIGHT__

function NavBar () {
  function async onLogin () {
__HIGHLIGHT__    redirectToAuth(); __END_HIGHLIGHT__
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