---
id: version-2.0.X-get-session-data
title: getSessionData
hide_title: true
original_id: get-session-data
---

# `getSessionData(sessionHandle)`

### Parameters
- `sessionHandle`
    - **type:** `string`

### Returns
- `Promise<object>`

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**
- **[UNAUTHORISED](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.