---
id: version-1.0.X-get-session-data
title: get_session_data
hide_title: true
original_id: get-session-data
---

# `get_session_data(session_handle)`

### Parameters
- `session_handle`
    - **type:** `string`

### Returns
- `dict`

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**
- **[SuperTokensUnauthorisedError](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.