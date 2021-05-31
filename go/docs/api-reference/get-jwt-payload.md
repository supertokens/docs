---
id: get-jwt-payload
title: GetJWTPayload
hide_title: true
---

# `GetJWTPayload(sessionHandle string) (map[string]interface{}, error)`

### Parameters
- `sessionHandle`
    - **description:** Get the JWT payload of the session that has the given `sessionHandle`.

### Returns
- `map[string]interface{}`
- [GeneralError](./error-handling/general-error)
- [UnauthorizedError](./error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired.