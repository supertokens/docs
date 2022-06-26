---
id: version-1.0.X-refresh-session
title: refreshSession
hide_title: true
original_id: refresh-session
---

# `refreshSession`

<!--DOCUSAURUS_CODE_TABS-->
<!--With Express-->
## `refreshSession(req, res)`
### Parameters

- `req`
    - **type:** `Express.Request`
- `res`
    - **type:** `Express.Response`

### Returns
- `Promise<Session>` on successful refresh. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[GENERAL_ERROR](../error-handling/general-error)**
- **[UNAUTHORISED](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired, or if the provided refresh token is invalid.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- **[TOKEN_THEFT_DETECTED](../error-handling/token-theft-detected)**
    - This is thrown if token theft is detected.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.

<!--Without Express-->
## `refreshSession(refreshToken)`
### Parameters
- `refreshToken`
    - **type:** `string`

### Returns
```ts
Promise<
    session: {
        handle: string;
        userId: string;
        userDataInJWT: any;
    };
    accessToken: {
        token: string;
        expiry: number;
        createdTime: number;
        cookiePath: string;
        cookieSecure: boolean;
        domain: string;
    };
    refreshToken: {
        token: string;
        expiry: number;
        createdTime: number;
        cookiePath: string;
        cookieSecure: boolean;
        domain: string;
    };
    idRefreshToken: {
        token: string;
        expiry: number;
        createdTime: number;
    };
    antiCsrfToken: string | undefined;
}>
```
> `antiCsrfToken` will be undefined if `enable_anti_csrf` (in the SuperTokens config.yaml) is set to false.

### Throws
- **[GENERAL_ERROR](../error-handling/general-error)**
- **[UNAUTHORISED](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired, or if the provided refresh token is invalid.
    - When this is thrown, please be sure to remove all relevant auth cookies.
- **[TOKEN_THEFT_DETECTED](../error-handling/token-theft-detected)**
    - This is thrown if token theft is detected.
    - When this is thrown, please be sure to remove all relevant auth cookies.
<!--END_DOCUSAURUS_CODE_TABS-->