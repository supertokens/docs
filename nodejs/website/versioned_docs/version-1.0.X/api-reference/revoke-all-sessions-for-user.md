---
id: version-1.0.X-revoke-all-sessions-for-user
title: revokeAllSessionsForUser
hide_title: true
original_id: revoke-all-sessions-for-user
---

# `revokeAllSessionsForUser(userId)`

### Parameters
- `userId`
    - **type:** `string`

### Returns
- `Promise<number>`
    - number of sessions revoked

### Throws
- [GENERAL_ERROR](../error-handling/general-error)

> This function deletes many sessions from the database. If it throws an error, then some sessions may already have been deleted.