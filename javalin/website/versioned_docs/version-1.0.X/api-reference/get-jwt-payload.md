---
id: version-1.0.X-get-jwt-payload
title: getJWTPayload
hide_title: true
original_id: get-jwt-payload
---

# `getJWTPayload(String sessionHandle)`

### Parameters
- `sessionHandle`
    - **description:** Get the JWT payload of the session that has the given `sessionHandle`.

### Returns
- `Map<String, Object>`

### Throws
- **[GeneralException](./error-handling/general-error)**
- **[UnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.