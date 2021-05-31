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

### Call the `setRelevantHeadersForOptionsAPI` function: [API Reference](../api-reference/set-relevant-headers-for-options-api)
```js
supertokens.setRelevantHeadersForOptionsAPI(res);
```
- This is to be called in your ```OPTIONS``` API
- Adds the following headers to the response:
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
const supertokens = require("supertokens-node");

app.options("/like-comment", function (req, res) {
    res.header("Access-Control-Allow-Origin", "some-origin.com");
    res.header("Access-Control-Allow-Methods", "POST");
    supertokens.setRelevantHeadersForOptionsAPI(res);
    res.send("success");
});
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";
import { Request, Response } from "express";

app.options("/like-comment", function (req: Request, res: Response) {
    res.header("Access-Control-Allow-Origin", "some-origin.com; ");
    res.header("Access-Control-Allow-Methods", "POST");
    supertokens.setRelevantHeadersForOptionsAPI(res);
    res.send("success");
});
```
<!--END_DOCUSAURUS_CODE_TABS-->