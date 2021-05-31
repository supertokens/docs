---
id: version-1.0.X-update-jwt-payload
title: update_jwt_payload
hide_title: true
original_id: update-jwt-payload
---

# `update_jwt_payload(session_handle, data)`

### Parameters
- `session_handle`
    - **type:** `string`
- `data`
    - **type:** `dict`

### Returns
- `void`

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**
- **[SuperTokensUnauthorisedError](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.

### Additional information
- The JWT updated payload information for that session will be reflected only when that session has been refreshed.
- If you want to update the JWT payload for the current session, please use the [`update_jwt_payload`](./session-object/update-jwt-payload) function in the `session` object.