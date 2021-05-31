---
id: version-1.0.X-get-session-data
title: getSessionData
hide_title: true
original_id: get-session-data
---

# `getSessionData(String sessionHandle)`

### Parameters
- `sessionHandle`
    - **description:** Get the session data of the session that has the given `sessionHandle`.

### Returns
- `Map<String, Object>`

### Throws
- **[GeneralException](./error-handling/general-error)**
- **[UnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.