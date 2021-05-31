---
id: version-0.6.X-third-party-auth
title: Third Party Auth wrapper
hide_title: true
original_id: third-party-auth
---

# ThirdPartyAuth reference API


The `ThirdPartyAuth` component is used to wrap any component that requires authentication in an application.


Example: 

```js
import SuperTokens from "supertokens-auth-react";
import {ThirdPartyAuth} from "supertokens-auth-react/recipe/thirdparty";

class App extends React.Components {
    render() {
__HIGHLIGHT__        return (
            <ThirdPartyAuth>
                <LoggedInComponents />
            </ThirdPartyAuth>
        ); __END_HIGHLIGHT__
    }
}
```