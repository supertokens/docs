---
id: version-0.14.X-components
title: Components
original_id: components
---

# EmailPassword component overrides
For general usage guide refer to [EmailPassword override guide](/docs/emailpassword/advanced-customizations/react-component-override/usage).

### The list of overridable components

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```ts
EmailPassword.init({
    override: {
        components: {
            EmailPasswordSignIn: ...,
            EmailPasswordSignInFooter: ...,
            EmailPasswordSignInForm: ...,
            EmailPasswordSignInHeader: ...,
            EmailPasswordSignUp: ...,
            EmailPasswordSignUpFooter: ...,
            EmailPasswordSignUpForm: ...,
            EmailPasswordSignUpHeader: ...,
            EmailPasswordResetPasswordEmail: ...,
            EmailPasswordSubmitNewPassword: ...,
        }
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->
