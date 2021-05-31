---
id: version-1.0.X-revoke-session
title: RevokeSession
hide_title: true
original_id: revoke-session
---

# `RevokeSession(sessionHandle string) (bool, error)`
### Parameters
- `sessionHandle`

### Returns
- `bool`
    - **true:** If a session was successfully removed from the database
    - **false:** If either the sessionHandle is invalid, or the session had already been removed
- [GeneralError](./error-handling/general-error)