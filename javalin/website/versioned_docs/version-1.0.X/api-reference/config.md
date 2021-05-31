---
id: version-1.0.X-config
title: config
hide_title: true
original_id: config
---

# `config(String config)`

### Parameters
- `config`:
    - **description:** `;` separated list of addresses (host and port) of SuperTokens instances.

### Returns
- `void`

### Throws
- **[GeneralException](./error-handling/general-error)**
    if the `config` string has an invalid syntax

<div class="divider"></div>

### Example
```java
import io.supertokens.javalin.*;

SuperTokens.config("losalhost:9000;192.168.1.2:3567");
```