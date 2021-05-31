---
id: revoke-all-sessions-for-user
title: revokeAllSessionsForUser
hide_title: true
---

# `revokeAllSessionsForUser(String userId)`

### Parameters
- `userId`

### Returns
- `String[]`
    - array of revoked session handles

### Throws
- **[GeneralException](./error-handling/general-error)**

> This function deletes many sessions from the database. If it throws an error, then some sessions may already have been deleted.