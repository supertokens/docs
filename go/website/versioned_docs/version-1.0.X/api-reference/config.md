---
id: version-1.0.X-config
title: Config
hide_title: true
original_id: config
---

# `Config(hosts string) error`

### Parameters
- `config`:
    - **description:** `;` separated list of addresses (host and port) of SuperTokens instances.

### Returns
- [GeneralError](./error-handling/general-error) when the syntax of the provided `hosts` string is incorrect

<div class="divider"></div>

### Example
```go
err := supertokens.Config("localhost:9000;192.168.1.2:3567");
```