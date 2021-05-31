---
id: update-session-data
title: updateSessionData
hide_title: true
---

# `UpdateSessionData(newSessionData map[string]interface{}) error`

### Parameters
- `newSessionData`
    - **description:** This information is stored only in your database, so it can contain sensitive information. The values in the map can be any of the primitive types, an `[]interface{}` or `map[string]interface{}`.

### Returns
- [GeneralError](../error-handling/general-error)
- [UnauthorisedError](../error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.