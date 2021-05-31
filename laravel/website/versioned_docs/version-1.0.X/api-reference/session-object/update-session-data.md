---
id: version-1.0.X-update-session-data
title: updateSessionData
hide_title: true
original_id: update-session-data
---

# `updateSessionData($newSessionData)`

### Parameters
- `$newSessionData`
    - **type:** `array`

### Returns
- `void`

### Throws
- **[SuperTokensGeneralException](../error-handling/general-error)**
- **[SuperTokensUnauthorisedException](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.