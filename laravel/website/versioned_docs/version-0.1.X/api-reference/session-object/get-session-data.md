---
id: version-0.1.X-get-session-data
title: getSessionData
hide_title: true
original_id: get-session-data
---

# `getSessionData()`

### Parameters
- none

### Returns
- `array | null`

### Throws
- [SuperTokensGeneralException](../../error-handling/general-error)
- [SuperTokensUnauthorisedException](../../error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.

> It does nothing to synchronize with other `getSessionData` or `updateSessionData` calls on this session. So it is up to you to handle various race conditions depending on your use case.