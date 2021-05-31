---
id: version-1.0.X-update-session-data
title: update_session_data
hide_title: true
original_id: update-session-data
---

# `update_session_data(session_handle, data)`

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