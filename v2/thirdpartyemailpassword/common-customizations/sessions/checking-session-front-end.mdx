---
id: checking-session-front-end
title: Checking if a session exists on the frontend
hide_title: true
---

# Checking if a session exists on the frontend

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
__HIGHLIGHT__            let {doesSessionExist} = useSessionContext(); __END_HIGHLIGHT__

            if (!doesSessionExist) {
                  // display UI to take the user to login
            } else {
                  // Your component for logged in user.
            }
      }
}
```

- Step 2: Wrap the above component with `ThirdPartyEmailPasswordAuth` (which provides the context)

```js
import { ThirdPartyEmailPasswordAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';

render() {

      /*
       * requireAuth = false means that even if a session doesn't exist,
       * the dashboard component will be shown. The reason we have this set
       * here is that if we didn't then doesSessionExist would always be
       * true in the Dashboard component, in which case you would not 
       * have to check for if a session exists.
      */
      return (
            <ThirdPartyEmailPasswordAuth requireAuth={false}>
                  <Dashboard />
            </ThirdPartyEmailPasswordAuth>
      );
}
```

## Without React context 
```js

import React from "react";
__HIGHLIGHT__ import Session from 'supertokens-auth-react/recipe/session'; __END_HIGHLIGHT__

class Dashboard extends React.Component {

      render() {
            if (!this.state.sessionExists) {
                  // display UI to take the user to login
            } else {
                  // Your component for logged in user.
            }
      }

      componentDidMount = async () {
            this.setState({
__HIGHLIGHT__                   sessionExists: await Session.doesSessionExist() __END_HIGHLIGHT__
            });
      }
}
```

<!--Plain JS-->
```js

// frontend code
import SuperTokens from 'supertokens-website';

if (await SuperTokens.doesSessionExist()) {
      // user is logged in
} else {
      // user has not logged in yet
}

```

<!--END_DOCUSAURUS_CODE_TABS-->
