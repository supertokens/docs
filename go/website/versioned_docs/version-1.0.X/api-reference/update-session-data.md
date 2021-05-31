---
id: version-1.0.X-update-session-data
title: UpdateSessionData
hide_title: true
original_id: update-session-data
---

# `UpdateSessionData(sessionHandle string, newSessionData map[string]interface{}) error`

### Parameters
- `sessionHandle`
- `newSessionData`

### Returns
- [GeneralError](./error-handling/general-error)
- [UnauthorizedError](./error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.