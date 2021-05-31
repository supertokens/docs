---
id: version-1.0.X-update-session-data
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
- [GENERAL_ERROR](../../error-handling/general-error)
- [UNAUTHORISED](../../error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.

> It does nothing to synchronize with other `getSessionData` or `updateSessionData` calls on this session. So it is up to you to handle various race conditions depending on your use case.