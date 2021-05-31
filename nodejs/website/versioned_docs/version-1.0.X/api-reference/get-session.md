---
id: version-1.0.X-get-session
title: getSession
hide_title: true
original_id: get-session
---

<!--DOCUSAURUS_CODE_TABS-->
<!--With Express-->
# `getSession(req, res, enableCsrfProtection)`
### Parameters
- `req`
    - **type:** `Express.Request`
- `res`
    - **type:** `Express.Response`
- `enableCsrfProtection`
    - **type:** `boolean`
    - **description:** If `enable_anti_csrf` (in the SuperTokens config.yaml) is set to false, this value will be considered as false even if value true is passed

### Returns
- `Promise<Session>` on successful verification of a session. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[GENERAL_ERROR](../error-handling/general-error)**
- **[UNAUTHORISED](../error-handling/unauthorised)**
    - This is thrown if a session does not exist, or has been revoked (if blacklisting is switched on).
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- **[TRY_REFRESH_TOKEN](../error-handling/try-refresh-token)**
    - This will be thrown if JWT verification fails. This happens, for example, if the token has expired or the JWT signing key has changed.
    - This will be thrown if CSRF protection is on and anti-csrf token is missing or invalid.
    - When this is thrown, none of the auth cookies are removed - you should return a session expired status code which will instruct your frontend to call the refresh token API endpoint.

### Additional information
- Verifies the current session using the req object.
- This function will mostly never require an I/O operation since we are using JWT access tokens (assuming that blacklisting is disabled).
- If `enableCsrfProtection` is true and `enable_anti_csrf` (in the SuperTokens config.yaml) is set to true, this function also provides CSRF protection. **We strongly recommend that you set it to true for any non-GET API that requires user auth (except for the refresh session API)**.
- May change the access token - but this is taken care of by this function and our frontend SDKs. You do need to worry about handling this.

<!--Without Express-->
# `getSession(accessToken, antiCsrfToken, doAntiCsrfCheck, idRefreshToken)`
### Parameters
- `accessToken`
    - **type:** `string`
- `antiCsrfToken`
    - **type:** `string OR undefined`
    - Pass undefined if you do not want to have CSRF protection for this auth call.
    - If `enable_anti_csrf` (in the SuperTokens config.yaml) is set to false, this value will be considered as undefined even if a string value is passed
- `doAntiCsrfCheck`
    - **type:** `boolean`
- `idRefreshToken`
    - **type:** `string OR undefined`

### Returns
```ts
Promise{
    session: {
        handle: string;
        userId: string;
        userDataInJWT: any;
    };
    accessToken?: {
        token: string;
        expiry: number;
        createdTime: number;
        cookiePath: string;
        cookieSecure: boolean;
        domain: string;
    };
}>
```

### Throws
- **[GENERAL_ERROR](../error-handling/general-error)**
- **[UNAUTHORISED](../error-handling/unauthorised)**
    - This is thrown if a session does not exist, or has been revoked (if blacklisting is switched on).
    - When this is thrown, please be sure to remove all relevant auth cookies and redirect the user to a login page. See the [Error Handling](../error-handling/unauthorised) section for more information.
- **[TRY_REFRESH_TOKEN](../error-handling/try-refresh-token)**
    - This will be thrown if JWT verification fails. This happens, for example, if the token has expired or the JWT signing key has changed.
    - This will be thrown if CSRF protection is on and anti-csrf token is missing or invalid.
    - When this is thrown, none of the auth cookies are removed - you should return a session expired status code which will instruct your frontend to call the refresh token API endpoint. Do not remove any auth cookie here. Our frontend SDKs takes care of this for you in most cases.

### Additional information
- This function will mostly never require an I/O operation since we are using JWT access tokens (assuming that blacklisting is disabled).
- Verifies the current session using input tokens.
- If `antiCsrfToken` is not undefined and `enable_anti_csrf` (in the SuperTokens config.yaml) is set to true, it also provides CSRF protection. **We strongly recommend that you use this feature for all your non-GET APIs (except for the refresh session API).**
<!--END_DOCUSAURUS_CODE_TABS-->