---
id: version-1.0.X-config-object
title: Configuration
hide_title: true
original_id: config-object
---

# Configurations
The ```config``` object has the following schema:

### Config
- **type:** `Array`
- **items:** [`HostProperty`](#hostproperty)
- **minimum items:** 1
- **description:** array of host properties. At-least one host property needs to be passed.

### HostProperty
| property | type   | required | description                                   | e.g.           |
| -------- | ------ | -------- | --------------------------------------------- | -------------- |
| hostname | string | true     | ip or host-name of SuperTokens instance        | ```"localhost"``` |
| port     | number | true     | port at which SuperTokens instance is running | ```3567```      |

<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let config = [{
    hostname: "localhost",
    port: 3567 // default port
}, {
    hostname: "some-other-server.com",
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
}, {
    hostname: "some-other-server.com",
    port: 3567 // default port
}];
```
<!--END_DOCUSAURUS_CODE_TABS-->
