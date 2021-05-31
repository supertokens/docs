---
id: version-1.0.X-get-all-session-handles-for-user
title: GetAllSessionHandlesForUser
hide_title: true
original_id: get-all-session-handles-for-user
---

# `GetAllSessionHandlesForUser(userID string) ([]string, error)`
### Parameters
- `userId`
    - **description:** All sessions of the give userId are revoked.

### Returns
- `[]string`
    - Each element in the `[]string` is a session handle
- [GeneralError](./error-handling/general-error)