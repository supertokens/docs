---
id: get-session
title: get_session
hide_title: true
---

# `get_session(request, enable_csrf_protection)`
### Parameters
- `request`
    - **type:** `fastapi.Request`
- `enable_csrf_protection`
    - **type:** `boolean`
    - **description:** If `enable_anti_csrf` (in the SuperTokens `config.yaml`) is set to `False`, this value will be considered as `False` even if value `True` is passed

### Returns
- `Awaitable[Session]` on successful verification of a session. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**
- **[SuperTokensUnauthorisedError](./error-handling/unauthorised)**
    - This is thrown if a session does not exist, or has been revoked (if blacklisting is switched on).
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- **[SuperTokensTryRefreshTokenError](./error-handling/try-refresh-token)**
    - This will be thrown if JWT verification fails. This happens, for example, if the token has expired or the JWT signing key has changed.
    - This will be thrown if CSRF protection is on and anti-csrf token is missing or invalid.
    - When this is thrown, none of the auth cookies are removed - you should return a session expired status code which will instruct your frontend to call the refresh token API endpoint.

### Additional information
- Verifies the current session using the req object.
- This function will mostly never require an I/O operation since we are using JWT access tokens (assuming that blacklisting is disabled).
- If `enable_csrf_protection` is True and `enable_anti_csrf` (in the SuperTokens config.yaml) is set to true, this function also provides CSRF protection. **We strongly recommend that you set it to true for any non-GET API that requires user auth (except for the refresh session API)**.
- May change the access token - but this is taken care of by this function and our frontend SDKs. You do need to worry about handling this.