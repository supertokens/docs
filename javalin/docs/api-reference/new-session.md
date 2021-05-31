---
id: new-session
title: newSession
hide_title: true
---

# `newSession(Context ctx, String userId).create()`
### Parameters
- `ctx`
    - **description:** The Javalin Context object
- `userId`
    - **description:** Should be used to ID a user in your system.

### Adding JWT Payload
```java
withJWTPayload(Map<String, Object> jwtPayload)
```
- `jwtPayload`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information. The values in the map can be any of the primitive types, an `Object[]` or `Map<String, Object>`.

### Adding Session Data
```java
withSessionData(Map<String, Object> sessionData)
```
- `sessionData`
    - **description:** This information is stored only in your database, so it can contain sensitive information. The values in the map can be any of the primitive types, an `Object[]` or `Map<String, Object>`.

### Returns
- `Session` on successful creation of a session. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[GeneralException](./error-handling/general-error)**

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These are set in the cookies and header of the `ctx` object.