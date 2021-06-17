---
id: version-0.14.X-components
title: Components
original_id: components
---

# EmailVerification component overrides
For general override usage guide refer to specific recipe's guide.

### The list of overridable components

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```ts
Recipe.init({
    override: {
        emailVerification: {
            components: {
                EmailVerificationSendVerifyEmail: ...,
                EmailVerificationVerifyEmailLinkClicked: ...,
            }
        },
    },
}
```
<!--END_DOCUSAURUS_CODE_TABS-->
