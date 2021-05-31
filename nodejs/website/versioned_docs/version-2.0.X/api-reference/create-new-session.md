---
id: version-2.0.X-create-new-session
title: createNewSession
hide_title: true
original_id: create-new-session
---

# `createNewSession(res, userId, jwtPayload?, sessionData?)`
### Parameters
- `res`
    - **type:** `Express.Response`
- `userId`
    - **type:** `string`
    - **description:** Should be used to ID a user in your system.
- `jwtPayload` (*Optional*)
    - **type:** `object`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information.
- `sessionData` (*Optional*)
    - **type:** `object`
    - **description:** This information is stored only in your database, so it can contain sensitive information.

### Returns
- `Promise<Session>` on successful creation of a session. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These are set in the cookies and header of the `res` object.