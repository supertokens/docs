---
id: get-jwt-payload
title: getJWTPayload
hide_title: true
---

# `getJWTPayload($sessionHandle)`
### Parameters

- `$sessionHandle`
    - **type:** `string`

### Returns
- `array`

### Throws
- **[SuperTokensGeneralException](./error-handling/general-error)**
- **[SuperTokensUnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.