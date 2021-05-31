---
id: version-1.0.X-update-jwt-payload
title: updateJWTPayload
hide_title: true
original_id: update-jwt-payload
---

# `updateJWTPayload(Map<String, Object>  newJWTPayload)`

### Parameters
- `newJWTPayload`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information. The values in the map can be any of the primitive types, an `Object[]` or `Map<String, Object>`.

### Returns
- `void`

### Throws
- **[GeneralException](../error-handling/general-error)**
- **[UnauthorisedException](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.