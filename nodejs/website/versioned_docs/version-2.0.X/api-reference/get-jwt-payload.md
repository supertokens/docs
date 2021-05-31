---
id: version-2.0.X-get-jwt-payload
title: getJWTPayload
hide_title: true
original_id: get-jwt-payload
---

# `getJWTPayload(sessionHandle)`

### Parameters
- `sessionHandle`
    - **type:** `string`

### Returns
- `Promise<object>`

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**
- **[UNAUTHORISED](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.