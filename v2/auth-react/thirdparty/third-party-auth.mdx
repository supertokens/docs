---
id: third-party-auth
title: Third Party Auth wrapper
hide_title: true
---

# Third Party Auth wrapper


The `ThirdPartyAuth` component is used to wrap any component that requires authentication in an application.


Example: 

```js
import SuperTokens from "supertokens-auth-react";
import {ThirdPartyAuth} from "supertokens-auth-react/recipe/thirdparty";

class App extends React.Components {
    render() {
__HIGHLIGHT__        return (
            <ThirdPartyAuth>
                <Dashboard />
            </ThirdPartyAuth>
        ); __END_HIGHLIGHT__
    }
}
```
- `ThirdPartyAuth` takes a prop called `requireAuth` which if set to `false`, will show the `Dashboard` component even if the user is not logged in.
- `ThirdPartyAuth` also creates a "Session context" which provides the following object to all children components:
   ```js
   {
       doesSessionExist: boolean,
       userId: string,
       jwtPayload: any /*JSON object set on the backend*/
   }
   ```
- `ThirdPartyAuth` will update the session, because it uses `SessionAuth` underneath. Read more about session updates in [SessionAuth guide](../session/session-auth).

## Handle session expiry
If you pass a function to `onSessionExpired` prop, it will be called whenever the session expires. This will also prevent children from receiving `SessionContext` update, so that you can preserve the UI for authenticated user.

Example:
```tsx
const App = () => {
    return (
        <ThirdPartyAuth onSessionExpired={notifyUserAndDisplayPopup}>
            {/* MyComponent won't have context updated when session expires */}
            <MyComponent />
        </ThirdPartyAuth >
    )
}
```
