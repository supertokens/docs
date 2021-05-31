---
id: version-1.0.X-update-session-data
title: updateSessionData
hide_title: true
original_id: update-session-data
---

# `updateSessionData(sessionHandle, data)`

### Parameters
- `sessionHandle`
    - **type:** `string`
    - **description:** Identifies a unique session in your system. Please see the [Session Handle](./session-handle) section for more information.
- `data`
    - **type:** `object`

### Returns
- `Promise<void>`

### Throws
- [GENERAL_ERROR](../error-handling/general-error)
- [UNAUTHORISED](../error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.