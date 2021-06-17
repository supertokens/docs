---
id: version-0.14.X-components
title: Components
original_id: components
---

# ThirdPartyEmailPassword component overrides
For general usage guide refer to [ThirdPartyEmailPassword override guide](/docs/thirdpartyemailpassword/advanced-customizations/react-component-override/usage).

### The list of overridable components

This list combines overridable components for [EmailPassword](/docs/auth-react/docs/emailpassword/override/components) and [ThirdParty](/docs/auth-react/docs/thirdparty/override/components) recipes

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```ts
ThirdPartyEmailPassword.init({
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
            ThirdPartySignUpFooter: ...,
            ThirdPartySignInAndUpProvidersForm: ...,
            ThirdPartySignInAndUpCallbackTheme: ...,
            ThirdPartyEmailPasswordHeader: ...,
            ThirdPartyEmailPasswordSignInAndUpForm: ...,
        }
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->
