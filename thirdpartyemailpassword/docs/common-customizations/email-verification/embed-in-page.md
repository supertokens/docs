---
id: embed-in-page
title: Embed in a page
hide_title: true
---

# Embed in a page 📑

Two steps to achieving this:
- First we disable the full page default implementation
- Then we render the email verification UI wherever we like


## Step 1: Disable default implementation 🔐

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
__HIGHLIGHT__            emailVerificationFeature: {
                mode: "REQUIRED",
                disableDefaultImplementation: true
            }, __END_HIGHLIGHT__
        }),
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

If you navigate to `/auth/verify-email`, you should not see the widget anymore.


## Step 2: Add component 📃

Add the `EmailVerification` component in your app:

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
__HIGHLIGHT__ import {EmailVerification} from 'supertokens-auth-react/recipe/thirdpartyemailpassword'; __END_HIGHLIGHT__

class EmailVerificationPage extends React.Component {
    render() {
        return (
            <div>
__HIGHLIGHT__                <EmailVerification/> __END_HIGHLIGHT__
            </div>
        )
    }
}

```
<!--END_DOCUSAURUS_CODE_TABS-->
