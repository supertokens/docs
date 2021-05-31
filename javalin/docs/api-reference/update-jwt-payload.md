---
id: update-jwt-payload
title: updateJWTPayload
hide_title: true
---

# `updateJWTPayload(String sessionHandle, Map<String, Object> newJWTPayload)`

### Parameters
- `sessionHandle`
- `newJWTPayload`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information. The values in the map can be any of the primitive types, an `Object[]` or `Map<String, Object>`.

### Returns
- `void`

### Throws
- **[GeneralException](./error-handling/general-error)**
- **[UnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.

### Additional information
- The JWT updated payload information for that session will be reflected only when that session has been refreshed.
- If you want to update the JWT payload for the current session, please use the [`updateJWTPayload` function in the `session` object](./session-object/update-jwt-payload).