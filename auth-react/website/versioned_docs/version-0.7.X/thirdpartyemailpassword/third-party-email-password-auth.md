---
id: version-0.7.X-third-party-email-password-auth
title: ThirdPartyEmailPassword Auth wrapper
hide_title: true
original_id: third-party-email-password-auth
---

# ThirdPartyEmailPasswordAuth reference API


The `ThirdPartyEmailPasswordAuth` component is used to wrap any component that requires authentication in an application.


Example: 

```js
import SuperTokens from "supertokens-auth-react";
import {ThirdPartyEmailPasswordAuth} from "supertokens-auth-react/recipe/thirdpartyemailpassword";

class App extends React.Components {
    render() {
__HIGHLIGHT__        return (
            <ThirdPartyEmailPasswordAuth>
                <LoggedInComponents />
            </ThirdPartyEmailPasswordAuth>
        ); __END_HIGHLIGHT__
    }
}
```