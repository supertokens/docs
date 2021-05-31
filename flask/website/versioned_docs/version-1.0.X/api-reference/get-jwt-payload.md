---
id: version-1.0.X-get-jwt-payload
title: get_jwt_payload
hide_title: true
original_id: get-jwt-payload
---

# `get_jwt_payload(session_handle)`

### Parameters
- `session_handle`
    - **type:** `string`

### Returns
- `dict`

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**
- **[SuperTokensUnauthorisedError](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.