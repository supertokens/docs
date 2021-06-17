---
id: changing-colours
title: Changing Colours
hide_title: true
---

# Changing Colours 🎨


It is possible to update the default theme with your colours to make it fit perfectly with your website by adding a `palette` property to the `ThirdParty.init` call.

For example if your website uses a dark theme, here is how you can quickly customize it:

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdParty.init({
__HIGHLIGHT__            palette: {
                background: '#333',
                error: '#ad2e2e',
                textTitle: "white",
                textLabel: "white",
                textInput: '#a9a9a9',
                textPrimary: "white",
                textLink: '#a9a9a9'
            } __END_HIGHLIGHT__
        }),
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

<img width="600px" src="/docs/static/assets/thirdparty/dark-theme.png" />

<div class="specialNote" style="margin-bottom: 40px">
    Changes to the palette will apply to the following forms:
    <br/><br/>
    <ul>
        <li>Login form</li>
        <li>Redirect callback page</li>
    </ul>
</div>

### Palette values

- **background**: 
    - Description: This value represent the background color of all forms.
    - Default: ```"white"```
    - Example: ```background: ""```

- **primary**: 
    - Description: This value represents the primary color used for displaying successful states and the loading circle shown in callback page post login.
    - Default: ```"#ff9b33"``` (orange)
    - Example: ```primary: "#ff9b33"```

- **success**: 
    - Description: This value represents the color used on success events.
    - Default: ```"#41a700"``` (green)
    - Example: ```success: "#41a700"```

- **error**: 
    - Description: This value represents the error color used for highlighting inputs with errors, and display error messages.
    - Default: ```"#ff1717"``` (red)
    - Example: ```error: "#ff1717"```

- **textTitle**: 
    - Description: This value represents the color of the title of each forms.
    - Default: ```"#222222"``` (black)
    - Example: ```textTitle: "#222222"```

<img width="400px" src="/docs/static/assets/thirdparty/textTitle.png" />

- **textPrimary**: 
    - Description: This value represents the main color used for subtitles and footer text.
    - Default: ```"#656565"``` (grey)
    - Example: ```textPrimary: "#656565"```

<img width="400px" src="/docs/static/assets/emailpassword/textPrimary.png" />

- **textLink**: 
    - Description: This value represents the color used for links (see the image above).
    - Default: ```"#0076ff"``` (blue)
    - Example: ```textLink: "#0076ff"```
