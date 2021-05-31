---
id: revoke-session
title: revokeSession
hide_title: true
---

# `revokeSession($sessionHandle)`
### Parameters

- `$sessionHandle`
    - **type:** `string`

### Returns
- `boolean` whether any session was revoked for the given `$sessionHandle`
    - **true:** If a session was successfully removed from the database
    - **false:** If either the sessionHandle is invalid, or the session had already been removed

### Throws
- **[SuperTokensGeneralException](./error-handling/general-error)**