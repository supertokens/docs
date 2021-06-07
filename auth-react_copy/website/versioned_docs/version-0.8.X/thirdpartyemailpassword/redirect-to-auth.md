---
id: version-0.8.X-redirect-to-auth
title: Redirect to auth page
hide_title: true
original_id: redirect-to-auth
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