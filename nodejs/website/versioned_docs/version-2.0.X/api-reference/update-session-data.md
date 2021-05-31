---
id: version-2.0.X-update-session-data
title: updateSessionData
hide_title: true
original_id: update-session-data
---

# `updateSessionData(sessionHandle, data)`

### Parameters
- `sessionHandle`
    - **type:** `string`
- `data`
    - **type:** `object`

### Returns
- `Promise<void>`

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**
- **[UNAUTHORISED](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.