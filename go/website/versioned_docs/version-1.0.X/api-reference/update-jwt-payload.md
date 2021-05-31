---
id: version-1.0.X-update-jwt-payload
title: UpdateJWTPayload
hide_title: true
original_id: update-jwt-payload
---

# `UpdateJWTPayload(sessionHandle string, newJWTPayload map[string]interface{}) error`

### Parameters
- `sessionHandle`
- `newJWTPayload`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information. The values in the map can be any of the primitive types, an `Object[]` or `Map<String, Object>`.

### Returns
- [GeneralError](./error-handling/general-error)
- [UnauthorizedError](./error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.

### Additional information
- The JWT updated payload information for that session will be reflected only when that session has been refreshed.
- If you want to update the JWT payload for the current session, please use the [`updateJWTPayload` function in the `session` object](./session-object/update-jwt-payload).