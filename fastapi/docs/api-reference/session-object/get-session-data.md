---
id: get-session-data
title: get_session_data
hide_title: true
---

# `get_session_data()`

### Parameters
- none

### Returns
- `Awaitable[dict]`

### Throws
- **[SuperTokensGeneralError](../error-handling/general-error)**
- **[SuperTokensUnauthorisedError](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.