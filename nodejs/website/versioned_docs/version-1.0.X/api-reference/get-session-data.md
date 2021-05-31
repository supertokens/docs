---
id: version-1.0.X-get-session-data
title: getSessionData
hide_title: true
original_id: get-session-data
---

# `getSessionData(sessionHandle)`

### Parameters
- `sessionHandle`
    - **type:** `string`
    - **description:** Identifies a unique session in your system. Please see the [Session Handle](./session-handle) section for more information.

### Returns
- `Promise<object>`

### Throws
- [GENERAL_ERROR](../error-handling/general-error)
- [UNAUTHORISED](../error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.