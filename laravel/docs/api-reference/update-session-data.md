---
id: update-session-data
title: updateSessionData
hide_title: true
---

# `updateSessionData($sessionHandle, $newSessionData)`
### Parameters

- `$sessionHandle`
    - **type:** `string`
- `$newSessionData`
    - **type:** `array`

### Returns
- `void`

### Throws
- **[SuperTokensGeneralException](./error-handling/general-error)**
- **[SuperTokensUnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.