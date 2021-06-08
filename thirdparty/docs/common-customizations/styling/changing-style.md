---
id: changing-style
title: Changing Style via CSS
hide_title: true
---

# Changing Style via CSS 🎭

Updating the palette might not provide enough flexibility for your needs. If you'd like to update some specific CSS attributes, it is possible to do so.

This section will guide you through an example of updating the button from the signup form. Note that the process can be applied to update any HTML tags from within SuperTokens components.


## Sign-Up / Sign-In

First, let's open our website at `/auth`. The Sign-in widget should show up. Let's use the browser console to find out the class name that we'd like to overwrite.


<img width="700px" src="/docs/static/assets/thirdparty/inspect-button.png" />

<img width="500px" src="/docs/static/assets/thirdparty/inspect-button-2.png" />

Each stylable components contains `data-supertokens` attributes (in our example `data-supertokens="headerTitle"`). 
Let's add a `headerTitle` attribute to our configuration file.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdParty.init({
            palette: {...},
            signInAndUpFeature: {
__HIGHLIGHT__                style: {
                    headerTitle: {
                        border: '3px',
                        borderColor: "#000000",
                        borderStyle: "solid"
                    }
                } __END_HIGHLIGHT__
            }
        }),
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

The above will result in: 

<img width="700px" src="/docs/static/assets/thirdparty/title-border.png" />

The syntax for styling is the same as <a href="https://www.w3schools.com/react/react_css.asp" target="_blank" rel="noopener noreferrer">React inline styling</a>

Using this same technique, you can fully customize your widgets.

## Email Verification

### Send verify email screen 

The same technique as above can be applied to tweak the send email form with the only difference that you should apply changes to `sendVerifyEmailScreen` from within the `emailVerificationFeature`.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
	recipeList: [
        ThirdParty.init({
__HIGHLIGHT__            emailVerificationFeature: {
                sendVerifyEmailScreen: {
                    style: {...}
                }
            }
        }), __END_HIGHLIGHT__
        Session.init()
	]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

### Verify email link clicked screen

The same technique as above can be applied to tweak the send email form with the only difference that you should apply changes to `verifyEmailLinkClickedScreen` from within the `emailVerificationFeature` feature.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
	recipeList: [
        ThirdParty.init({
__HIGHLIGHT__            emailVerificationFeature: {
                verifyEmailLinkClickedScreen: {
                    style: {...}
                }
            }
        }), __END_HIGHLIGHT__
        Session.init()
	]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->