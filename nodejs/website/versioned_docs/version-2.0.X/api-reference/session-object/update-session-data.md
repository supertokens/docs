---
id: version-2.0.X-update-session-data
title: updateSessionData
hide_title: true
original_id: update-session-data
---

# `updateSessionData(data)`

### Parameters
- `data`
    - **type:** `object`

### Returns
- `Promise<void>`

### Throws
- **[GENERAL_ERROR](../error-handling/general-error)**
- **[UNAUTHORISED](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.