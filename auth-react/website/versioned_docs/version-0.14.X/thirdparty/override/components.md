---
id: version-0.14.X-components
title: Components
original_id: components
---

## ThirdParty component overrides
For general usage guide refer to [ThirdParty override guide](/docs/thirdparty/advanced-customizations/react-component-override/usage).

### The list of overridable components

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```ts
ThirdPartyEmailPassword.init({
    override: {
        components: {
            ThirdPartySignUpFooter: ...,
            ThirdPartySignInAndUpProvidersForm: ...,
            ThirdPartySignInAndUpCallbackTheme: ...,
        }
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->
