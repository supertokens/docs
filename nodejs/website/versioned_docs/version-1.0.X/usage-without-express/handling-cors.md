---
id: version-1.0.X-handling-cors
title: Handling CORS
hide_title: true
original_id: handling-cors
---

# Handling CORS
<div class="specialNote" style="margin-bottom: 20px">
This section is only applicable to web browser based apps when the website domain is different to the API domain. Differences can be in hostname or in the port number.
</div>

### Set the following headers in the options API
- `Access-Control-Allow-Headers: "anti-csrf"`
- `Access-Control-Allow-Headers: "supertokens-sdk-name"`
- `Access-Control-Allow-Headers: "supertokens-sdk-version"`
- `Access-Control-Allow-Credentials: true`

> You'll also need to add ```Access-Control-Allow-Credentials``` header with value ```true``` and ```Access-Control-Allow-Origin``` header to ```YOUR_SUPPORTED_ORIGINS``` for all the routes in which you will be using SuperTokens.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
function setOptionsApiHeaders() {
    setHeader("Access-Control-Allow-Headers", "anti-csrf");
    setHeader("Access-Control-Allow-Headers", "supertokens-sdk-name");
    setHeader("Access-Control-Allow-Headers", "supertokens-sdk-version");
    setHeader("Access-Control-Allow-Origin", "some-origin.com; ");
    setHeader("Access-Control-Allow-Methods", "POST");
});

function setHeader(key, value) {
    // this will be specific to your framework...
}
```
<!--Typescript-->
```ts
function setOptionsApiHeaders() {
    setHeader("Access-Control-Allow-Headers", "anti-csrf");
    setHeader("Access-Control-Allow-Headers", "supertokens-sdk-name");
    setHeader("Access-Control-Allow-Headers", "supertokens-sdk-version");
    setHeader("Access-Control-Allow-Origin", "some-origin.com; ");
    setHeader("Access-Control-Allow-Methods", "POST");
});

function setHeader(key: string, value: string) {
    // this will be specific to your framework...
}
```
<!--END_DOCUSAURUS_CODE_TABS-->