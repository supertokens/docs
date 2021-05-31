---
id: revoke-all-sessions-for-user
title: RevokeAllSessionsForUser
hide_title: true
---

# `RevokeAllSessionsForUser(userID string) ([]string, error)`

### Parameters
- `userID`

### Returns
- `[]string`
    - array of revoked session handles
- [GeneralError](./error-handling/general-error)

> This function deletes many sessions from the database. If it throws an error, then some sessions may already have been deleted.