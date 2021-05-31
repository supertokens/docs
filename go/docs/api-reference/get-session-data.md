---
id: get-session-data
title: GetSessionData
hide_title: true
---

# `GetSessionData(sessionHandle string) (map[string]interface{}, error)`

### Parameters
- `sessionHandle`
    - **description:** Get the session data of the session that has the given `sessionHandle`.

### Returns
- `map[string]interface{}`
- [GeneralError](./error-handling/general-error)
- [UnauthorizedError](./error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.