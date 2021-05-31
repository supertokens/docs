---
id: version-2.0.X-init
title: init
hide_title: true
original_id: init
---

# `init(config)`

### Parameters
- `config`:
    - **type:** `object`. To see the fields in this object, visit the [Configuration](./config-object) page.

### Returns
- `void`

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**
    if the ***config*** object passed is invalid

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let supertokens = require("supertokens-node");

let config = [{
    hostname: "localhost",
    port: 8888
}];

supertokens.init(config);
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

interface HostProperty {
    hostname: string;
    port: number;
}

let config: HostProperty[] = [{
    hostname: "localhost",
    port: 8888
}];

supertokens.init(config);
```
<!--END_DOCUSAURUS_CODE_TABS-->