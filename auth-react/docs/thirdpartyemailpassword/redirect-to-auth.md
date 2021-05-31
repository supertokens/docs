---
id: redirect-to-auth
title: Redirect to auth page
hide_title: true
---

# RedirectToAuth reference API

The `redirectToAuth` method simply redirect the user to sign-in/sign-up page UI.

Example: 

```js
import { redirectToAuth } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

redirectToAuth("signin");
```

- **redirectToAuth**: 
    - Description: `redirectToAuth` will redirect the user to sign-in/sign-up page UI.
    - Parameters:
        - `show` (Optional): Allowed values are `signin` and `signout`
    - Output:
        - `void`