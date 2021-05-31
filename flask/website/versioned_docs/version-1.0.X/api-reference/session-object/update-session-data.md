---
id: version-1.0.X-update-session-data
title: update_session_data
hide_title: true
original_id: update-session-data
---

# `update_session_data(data)`

### Parameters
- `data`
    - **type:** `dict`

### Returns
- `void`

### Throws
- **[SuperTokensGeneralError](../error-handling/general-error)**
- **[SuperTokensUnauthorisedError](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.