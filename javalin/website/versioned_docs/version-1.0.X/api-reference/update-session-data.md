---
id: version-1.0.X-update-session-data
title: updateSessionData
hide_title: true
original_id: update-session-data
---

# `updateSessionData(String sessionHandle, Map<String, Object> newData)`

### Parameters
- `sessionHandle`
- `newData`
    - **type:** `object`

### Returns
- `void`

### Throws
- **[GeneralException](./error-handling/general-error)**
- **[UnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.