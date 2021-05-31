---
id: version-0.1.X-update-session-data
title: updateSessionData
hide_title: true
original_id: update-session-data
---

# `updateSessionData($newSessionData)`

### Parameters
- `$newSessionData`
    - **type:** `array | null`

### Returns
- `void`

### Throws
- [SuperTokensGeneralException](../../error-handling/general-error)
- [SuperTokensUnauthorisedException](../../error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.

> It does nothing to synchronize with other `getSessionData` or `updateSessionData` calls on this session. So it is up to you to handle various race conditions depending on your use case.