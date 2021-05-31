---
id: version-1.0.X-refresh-session
title: refreshSession
hide_title: true
original_id: refresh-session
---

# `refreshSession(Context ctx)`
### Parameters
- `ctx`
    - **description:** The context object provided by Javalin

### Returns
- `Session` on successful refresh. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[GeneralException](./error-handling/general-error)**
- **[UnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired, or if the provided refresh token is invalid.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- **[TokenTheftDetectedException](./error-handling/token-theft-detected)**
    - This is thrown if token theft is detected.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.