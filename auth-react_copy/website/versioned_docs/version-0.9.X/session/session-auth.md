---
id: version-0.9.X-session-auth
title: Session Auth wrapper
hide_title: true
original_id: session-auth
---

# Session Auth wrapper

The `SessionAuth` component is used to wrap any component that requires the session context.


Example: 

```js
import SuperTokens from "supertokens-auth-react";
class App extends React.Components {
    render() {
__HIGHLIGHT__        return (
            <SessionAuth>
                <Dashboard />
            </SessionAuth>
        ); __END_HIGHLIGHT__
    }
}
```
- `SessionAuth` creates a "Session context" which provides the following object to all children components:
   ```js
   {
       doesSessionExist: boolean,
       userId: string,
       jwtPayload: any /*JSON object set on the backend*/
   }
   ```