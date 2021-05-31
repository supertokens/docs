---
id: password-managers
title: Password managers
hide_title: true
---

# Password managers 🔑


Styling encapsulation relies on <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM" target="_blank" rel="noreferer noopener">shadow DOM browser feature</a>. 

**Unfortunately password managers such as Dashlane, LastPass, OnePassword, etc... do not detect authentication forms fields inside shadow DOMs.**

 If you would like to make sure that your end users can use their password managers, you will have to disable shadow DOM. 



<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            useShadowDom: false
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

<img width="600px" src="/docs/static/assets/emailpassword/password-manager.png" />


<div class="specialNote" style="margin-bottom: 20px">

- SuperTokens uses only randomized styles to define its styling so disabling shadow DOM  should not impact the rest of your application's styles. On the other hand, when disabling Shadow DOM, make sure to verify that your CSS does not impact how SuperTokens UI is rendered.
- Shadow DOM will always be disabled with Internet Explorer since it does not support it. Similarly, if you intend to support Internet Explorer for your application make sure to verify how SuperTokens UI is rendered.
</div>
