---
id: revoke-session
title: RevokeSession
hide_title: true
---

# `RevokeSession(sessionHandle string) (bool, error)`
### Parameters
- `sessionHandle`

### Returns
- `bool`
    - **true:** If a session was successfully removed from the database
    - **false:** If either the sessionHandle is invalid, or the session had already been removed
- [GeneralError](./error-handling/general-error)