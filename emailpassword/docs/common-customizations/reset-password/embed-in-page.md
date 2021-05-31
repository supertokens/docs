---
id: embed-in-page
title: Embed in a page
hide_title: true
---

# Embed in a page 📑

Two steps to achieving this:
- First we disable the full page default implementation
- Then we render the reset password UI wherever we like


## Step 1: Disable default implementation 🔐

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
__HIGHLIGHT__            resetPasswordUsingTokenFeature: {
                disableDefaultImplementation: true
            }, __END_HIGHLIGHT__
        }),
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

If you navigate to `/auth/reset-password`, you should not see the widget anymore.


## Step 2: Add component 📃

Add the `ResetPasswordUsingToken` component in your app:

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
__HIGHLIGHT__ import {ResetPasswordUsingToken} from 'supertokens-auth-react/recipe/emailpassword'; __END_HIGHLIGHT__

class ResetPasswordPage extends React.Component {
    render() {
        return (
            <div>
__HIGHLIGHT__                <ResetPasswordUsingToken/> __END_HIGHLIGHT__
            </div>
        )
    }
}

```
<!--END_DOCUSAURUS_CODE_TABS-->
