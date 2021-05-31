---
id: get-all-session-handles-for-user
title: GetAllSessionHandlesForUser
hide_title: true
---

# `GetAllSessionHandlesForUser(userID string) ([]string, error)`
### Parameters
- `userId`
    - **description:** All sessions of the give userId are revoked.

### Returns
- `[]string`
    - Each element in the `[]string` is a session handle
- [GeneralError](./error-handling/general-error)