---
id: version-1.0.X-revoke-session-using-session-handle
title: revokeSessionUsingSessionHandle
hide_title: true
original_id: revoke-session-using-session-handle
---

# `revokeSessionUsingSessionHandle(sessionHandle)`
### Parameters
- `sessionHandle`
    - **type:** `string`
    - **description:** Identifies a unique session in your system. Please see the [Session Handle](./session-handle) section for more information.

### Returns
- `Promise<boolean>`
    - **true:** If a session was successfully removed from the database
    - **false:** If either the sessionHandle is invalid, or the session had already been removed

### Throws
- [GENERAL_ERROR](../error-handling/general-error)