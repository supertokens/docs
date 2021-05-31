---
id: version-2.0.X-refresh-session
title: refreshSession
hide_title: true
original_id: refresh-session
---

# `refreshSession(req, res)`
### Parameters

- `req`
    - **type:** `Express.Request`
- `res`
    - **type:** `Express.Response`

### Returns
- `Promise<Session>` on successful refresh. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**
- **[UNAUTHORISED](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired, or if the provided refresh token is invalid.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- **[TOKEN_THEFT_DETECTED](./error-handling/token-theft-detected)**
    - This is thrown if token theft is detected.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.