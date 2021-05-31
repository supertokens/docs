---
id: refresh-session
title: refresh_session
hide_title: true
---

# `refresh_session(res)`
### Parameters

- `res`
    - **type:** `flask.Response`

### Returns
- `Session` on successful refresh. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**
- **[SuperTokensUnauthorisedError](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired, or if the provided refresh token is invalid.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- **[SuperTokensTryRefreshTokenError](./error-handling/token-theft-detected)**
    - This is thrown if token theft is detected.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.