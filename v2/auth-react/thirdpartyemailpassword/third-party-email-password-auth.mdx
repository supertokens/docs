---
id: third-party-email-password-auth
title: ThirdPartyEmailPassword Auth wrapper
hide_title: true
---

# ThirdPartyEmailPassword Auth wrapper


The `ThirdPartyEmailPasswordAuth` component is used to wrap any component that requires authentication in an application.


Example: 

```js
import SuperTokens from "supertokens-auth-react";
import {ThirdPartyEmailPasswordAuth} from "supertokens-auth-react/recipe/thirdpartyemailpassword";

class App extends React.Components {
    render() {
__HIGHLIGHT__        return (
            <ThirdPartyEmailPasswordAuth>
                <Dashboard />
            </ThirdPartyEmailPasswordAuth>
        ); __END_HIGHLIGHT__
    }
}
```

- `ThirdPartyEmailPasswordAuth` takes a prop called `requireAuth` which if set to `false`, will show the `Dashboard` component even if the user is not logged in.
- `ThirdPartyEmailPasswordAuth` also creates a "Session context" which provides the following object to all children components:
   ```js
   {
       doesSessionExist: boolean,
       userId: string,
       jwtPayload: any /*JSON object set on the backend*/
   }
   ```
- `ThirdPartyEmailPasswordAuth` will update the session, because it uses `SessionAuth` underneath. Read more about session updates in [SessionAuth guide](../session/session-auth).

## Handle session expiry
If you pass a function to `onSessionExpired` prop, it will be called whenever the session expires. This will also prevent children from receiving `SessionContext` update, so that you can preserve the UI for authenticated user.

Example:
```tsx
const App = () => {
    return (
        <ThirdPartyEmailPasswordAuth onSessionExpired={notifyUserAndDisplayPopup}>
            {/* MyComponent won't have context updated when session expires */}
            <MyComponent />
        </ThirdPartyEmailPasswordAuth >
    )
}
```
