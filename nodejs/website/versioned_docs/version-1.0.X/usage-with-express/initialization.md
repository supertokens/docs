---
id: version-1.0.X-initialization
title: Initialization
hide_title: true
original_id: initialization
---

# Initialization

> This needs to be done only at the start of your Node app. If it fails, then you should restart your Node app.

### Import the package
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";
```
<!--END_DOCUSAURUS_CODE_TABS-->

### Configure
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let config = [{
    hostname: "localhost",
    port: 3567 // default port
}];
```
<!--Typescript-->
```ts
interface HostProperty {
    hostname: string;
    port: number;
}

let config: HostProperty[] = [{
    hostname: "localhost",
    port: 3567 // default port
}];
```
<!--END_DOCUSAURUS_CODE_TABS-->

For more info on the config object, click [here](../api-reference/config-object)

### Init [API Reference](../api-reference/init)
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
supertokens.init(config);
```
<!--Typescript-->
```ts
supertokens.init(config);
```
<!--END_DOCUSAURUS_CODE_TABS-->

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
const supertokens = require("supertokens-node");

let config = [{
    hostname: "localhost",
    port: 3567 // default port
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
    port: 3567 // default port
}];

supertokens.init(config);
```
<!--END_DOCUSAURUS_CODE_TABS-->