---
id: version-0.9.X-third-party-auth
title: Third Party Auth wrapper
hide_title: true
original_id: third-party-auth
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