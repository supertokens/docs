---
id: version-2.0.X-update-jwt-payload
title: updateJWTPayload
hide_title: true
original_id: update-jwt-payload
---

# `updateJWTPayload(sessionHandle, data)`

### Parameters
- `sessionHandle`
    - **type:** `string`
- `data`
    - **type:** `object`

### Returns
- `Promise<void>`

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**
- **[UNAUTHORISED](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.

### Additional information
- The JWT updated payload information for that session will be reflected only when that session has been refreshed.
- If you want to update the JWT payload for the current session, please use the [`updateJWTPayload`](./session-object/update-jwt-payload) function in the `session` object.