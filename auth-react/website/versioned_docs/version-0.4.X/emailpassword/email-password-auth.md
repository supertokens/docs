---
id: version-0.4.X-email-password-auth
title: Email Password Auth wrapper
hide_title: true
original_id: email-password-auth
---

# EmailPasswordAuth reference API


The `EmailPasswordAuth` component is used to wrap any component that requires authentication in an application.


Example: 

```js
import SuperTokens from "supertokens-auth-react";
class App extends React.Components {
    render() {
__HIGHLIGHT__        return (
            <EmailPasswordAuth>
                <LoggedInComponents />
            </EmailPasswordAuth>
        ); __END_HIGHLIGHT__
    }
}
```