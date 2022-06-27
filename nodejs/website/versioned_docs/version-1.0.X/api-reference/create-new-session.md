---
id: version-1.0.X-create-new-session
title: createNewSession
hide_title: true
original_id: create-new-session
---

# `createNewSession`

<!--DOCUSAURUS_CODE_TABS-->
<!--With Express-->
## `createNewSession(res, userId, jwtPayload?, sessionData?)`
### Parameters
- `res`
    - **type:** `Express.Response`
- `userId`
    - **type:** `string`
    - **description:** Should be used to ID a user in your system.
- `jwtPayload` (*Optional*)
    - **type:** `object`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information. Once set, it cannot be changed during the lifetime of a session.
- `sessionData` (*Optional*)
    - **type:** `object`
    - **description:** This information is stored only in your database, so it can contain sensitive information if needed. This can be freely modified during the lifetime of a session. But we do not synchronize calls to modify this - you must take care of locks yourself.

### Returns
- `Promise<Session>` on successful creation of a session. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[GENERAL_ERROR](../error-handling/general-error)**

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These are set in the cookies and header of the `res` object.

<!--Without Express-->
## `createNewSession(userId, jwtPayload?, sessionData?)`
### Parameters
- `userId`
    - **type:** `string`
    - **description:** Should be used to ID a user in your system.
- `jwtPayload` (*Optional*)
    - **type:** `object`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information. Once set, it cannot be changed during the lifetime of a session.
- `sessionData` (*Optional*)
    - **type:** `object`
    - **description:** This information is stored only in your database, so it can contain sensitive information if needed. This can be freely modified during the lifetime of a session. But we do not synchronize calls to modify this - you must take care of locks yourself.

### Returns
```ts
Promise<{
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

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These need to be set in the cookies and headers of your response as explained [here](../usage-without-express/user-login)
<!--END_DOCUSAURUS_CODE_TABS-->