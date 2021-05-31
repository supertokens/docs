---
id: version-1.0.X-get-session-data
title: GetSessionData
hide_title: true
original_id: get-session-data
---

# `GetSessionData() (map[string]interface{}, error)`

### Parameters
- none

### Returns
- `map[string]interface{}`
- [GeneralError](../error-handling/general-error)
- [UnauthorizedError](../error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.