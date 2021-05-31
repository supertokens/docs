---
id: version-2.0.X-revoke-session
title: revokeSession
hide_title: true
original_id: revoke-session
---

# `revokeSession(sessionHandle)`
### Parameters
- `sessionHandle`
    - **type:** `string`

### Returns
- `Promise<boolean>`
    - **true:** If a session was successfully removed from the database
    - **false:** If either the sessionHandle is invalid, or the session had already been removed

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**