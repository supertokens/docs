---
id: update-session-data
title: UpdateSessionData
hide_title: true
---

# `UpdateSessionData(sessionHandle string, newSessionData map[string]interface{}) error`

### Parameters
- `sessionHandle`
- `newSessionData`

### Returns
- [GeneralError](./error-handling/general-error)
- [UnauthorizedError](./error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.