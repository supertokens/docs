---
id: revoke-session
title: revokeSession
hide_title: true
---

# `revokeSession(String sessionHandle)`
### Parameters
- `sessionHandle`

### Returns
- `boolean`
    - **true:** If a session was successfully removed from the database
    - **false:** If either the sessionHandle is invalid, or the session had already been removed

### Throws
- **[GeneralException](./error-handling/general-error)**