---
id: get-session-data
title: getSessionData
hide_title: true
---

# `getSessionData()`

### Parameters
- none

### Returns
- `array`

### Throws
- **[SuperTokensGeneralException](../error-handling/general-error)**
- **[SuperTokensUnauthorisedException](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.