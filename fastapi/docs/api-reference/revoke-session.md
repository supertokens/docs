---
id: revoke-session
title: revoke_session
hide_title: true
---

# `revoke_session(session_handle)`
### Parameters
- `session_handle`
    - **type:** `str`

### Returns
- `Awaitable[boolean]`
    - **True:** If a session was successfully removed from the database
    - **False:** If either the session_handle is invalid, or the session had already been removed

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**