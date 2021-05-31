---
id: reading-role-in-frontend
title: Reading roles in the frontend
hide_title: true
---

# Reading roles in the frontend

If a session exists on the frontend, we can read the role by getting information from the session:

<!--DOCUSAURUS_CODE_TABS-->
<!--With ReactJS-->
## With React context

> This is supported in supertokens-auth-react >= 0.9.0. For lower versions, see "Without React context" (scroll down).

This is two step process:
- Step 1: This is how to use the session context in a component:
```js

import React from "react";
__HIGHLIGHT__ import { useSessionContext } from 'supertokens-auth-react/recipe/session'; __END_HIGHLIGHT__

class Dashboard extends React.Component {

      render() {
__HIGHLIGHT__            let {userId, jwtPayload} = useSessionContext(); __END_HIGHLIGHT__

            // we use the key "role" here since that's what we
            // used while setting the payload in the backend. 
            let role = jwtPayload.role;

            if (role === "admin") {
                  // TODO..
            } else {
                  // TODO..
            }
      }
}
```

- Step 2: Wrap the above component with `ThirdPartyAuth` (which provides the context)

```js
import { ThirdPartyAuth } from 'supertokens-auth-react/recipe/thirdparty';

render() {
     return (
           <ThirdPartyAuth>
                  <Dashboard />
           </ThirdPartyAuth>
     );
}
```


## Without React context 
```js
import Session from 'supertokens-auth-react/recipe/session';

if (await Session.doesSessionExist()) {
    
    // we use the key "role" here since that's what we
    // used while setting the payload in the backend. 
    let role = await Session.getJWTPayloadSecurely()["role"];
}
```

<!--Plain JS-->
```js
import SuperTokens from 'supertokens-website';

if (await SuperTokens.doesSessionExist()) {

    // we use the key "role" here since that's what we
    // used while setting the payload in the backend. 
    let jwtPayload = await SuperTokens.getJWTPayloadSecurely()["role"];
}
```

<!--END_DOCUSAURUS_CODE_TABS-->
