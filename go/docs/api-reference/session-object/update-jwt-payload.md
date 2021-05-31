---
id: update-jwt-payload
title: UpdateJWTPayload
hide_title: true
---

# `UpdateJWTPayload(newJWTPayload map[string]interface{}) error`

### Parameters
- `newJWTPayload`
    - **description:** This information is stored in the JWT sent to the frontend. So it should not contain sensitive information. The values in the map can be any of the primitive types, an `[]interface{}` or `map[string]interface{}`.

### Returns
- [GeneralError](../error-handling/general-error)
- [UnauthorisedError](../error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.