---
id: refresh-session
title: refreshSession
hide_title: true
---

# `refreshSession($request, $response)`
### Parameters

- `$request`
    - **type:** `\Illuminate\Http\Request`
- `$response`
    - **type:** `\Illuminate\Http\Response`

### Returns
- `\SuperTokens\Session` on successful refresh. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[SuperTokensGeneralException](./error-handling/general-error)**
- **[SuperTokensUnauthorisedException](./error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired, or if the provided refresh token is invalid.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- **[SuperTokensTokenTheftException](./error-handling/token-theft-detected)**
    - This is thrown if token theft is detected.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.