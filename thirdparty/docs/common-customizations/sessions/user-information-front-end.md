---
id: user-information-front-end
title: Get user information on the frontend
hide_title: true
---

# Get user information on the frontend

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

### Automatic context updates
`SessionContext` will be updated for `ThirdPartyAuth` children whenever any of the following events happens:
- App is loaded or reloaded
- User signs in
- User signs out
- Session expires
- Session is refreshed

The only exception is when you use `onSessionExpired`, which is explained in [Handling session expiry](./handling-session-expiry).

You can read more about `ThirdPartyAuth` in [its API guide](/docs/auth-react/docs/thirdparty/third-party-auth)

## Without React context 
```js
import Session from 'supertokens-auth-react/recipe/session';

if (await Session.doesSessionExist()) {
      let userId = await Session.getUserId();
      let jwtPayload = await Session.getJWTPayloadSecurely();
}
```

<!--Plain JS-->
```js
import SuperTokens from 'supertokens-website';

if (await SuperTokens.doesSessionExist()) {
      let userId = await SuperTokens.getUserId();
      let jwtPayload = await SuperTokens.getJWTPayloadSecurely();
}
```

<!--END_DOCUSAURUS_CODE_TABS-->
