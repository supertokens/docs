---
id: version-2.3.X-handling-cors
title: Handling CORS
hide_title: true
original_id: handling-cors
---

# Handling CORS

### Use the npm `cors` library along with `getCORSAllowedHeaders` function: [API Reference](../api-reference/get-cors-allowed-headers)
- `getCORSAllowedHeaders()` returns an array of headers that is used by SuperTokens. These need to go in the `Access-Control-Allow-Headers` header.
- You'll also need to use ```Access-Control-Allow-Credentials``` and ```Access-Control-Allow-Origin```

The above can be achieved easily via the `cors` library as seen below

<div class="divider"></div>

### Example
```js
let SuperTokens = require("supertokens-node");
let express = require("express");
let cors = require("cors");

let app = express();
app.use(
    cors({
        origin: "http://127.0.0.1:8080",
        allowedHeaders: ["content-type", ...SuperTokens.getCORSAllowedHeaders()],
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true,
    })
);
```