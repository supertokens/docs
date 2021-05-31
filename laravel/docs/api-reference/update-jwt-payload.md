---
id: update-jwt-payload
title: updateJWTPayload
hide_title: true
---

# `updateJWTPayload($sessionHandle, $newJWTPayload)`
### Parameters

- `$sessionHandle`
    - **type:** `string`
- `$newJWTPayload`
    - **type:** `array`

### Returns
- `void`

### Throws
- **[SuperTokensGeneralException](./error-handling/general-error)**
- **[SuperTokensUnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.


### Additional information
- The JWT updated payload information for that session will be reflected only when that session has been refreshed.
- If you want to update the JWT payload for the current session, please use the [`updateJWTPayload`](./session-object/update-jwt-payload) function in the `$session` object.