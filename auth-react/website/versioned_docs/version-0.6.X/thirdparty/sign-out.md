---
id: version-0.6.X-sign-out
title: Sign Out
hide_title: true
original_id: sign-out
---

# Sign out reference API


The `signOut` method simply revokes the session for the user. It does not provide any UI for a Sign out button and does not do any redirect in your page on your behalf. Please make sure to implement those yourself.

Example: 

```js
import { signOut } from "supertokens-auth-react/recipe/thirdparty";

await signOut();
```

- **signOut**: 
    - Description: `signOut` method called to revoke the current session. Under the hood, it calls the `revokeSession` from `supertokens-website`. Note that this method is asynchronous and you should wait for it to return before considering it was successful.
    - Output:
        - `200`: if successful