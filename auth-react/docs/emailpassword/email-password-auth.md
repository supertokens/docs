---
id: email-password-auth
title: Email Password Auth wrapper
hide_title: true
---

# Email Password Auth wrapper


The `EmailPasswordAuth` component is used to wrap any component that requires authentication in an application.


Example: 

```js
import SuperTokens from "supertokens-auth-react";
class App extends React.Components {
    render() {
__HIGHLIGHT__        return (
            <EmailPasswordAuth>
                <Dashboard />
            </EmailPasswordAuth>
        ); __END_HIGHLIGHT__
    }
}
```
- `EmailPasswordAuth` takes a prop called `requireAuth` which if set to `false`, will show the `Dashboard` component even if the user is not logged in.
- `EmailPasswordAuth` also creates a "Session context" which provides the following object to all children components:
   ```js
   {
       doesSessionExist: boolean,
       userId: string,
       jwtPayload: any /*JSON object set on the backend*/
   }
   ```