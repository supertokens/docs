---
id: version-1.0.X-get-jwt-payload
title: getJWTPayload
hide_title: true
original_id: get-jwt-payload
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