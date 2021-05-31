---
id: version-1.0.X-session-object
title: Session Object
hide_title: true
original_id: session-object
---

# Session Object

### `getUserId` function: [API Reference](../api-reference/session-object/get-user-id)
```java
String userId = session.getUserId();
```
- This function does not do any database call.

### `getJWTPayload` function: [API Reference](../api-reference/session-object/get-jwt-payload)
```java
Map<String, Object> jwtPayload = session.getJWTPayload();
```
- This function does not do any database call.

### `updateJWTPayload` function: [API Reference](../api-reference/session-object/update-jwt-payload)
```java
Map<String, Object> newData = new HashMap<>();
newData.put("key", "value");
session.updateJWTPayload(newData);
```
- This function will change the current access token
- This function requires a database call each time it's called.

### `getSessionData` function: [API Reference](../api-reference/session-object/get-session-data)
```java
Map<String, Object> sessionData = session.getSessionData();
```
- This function requires a database call each time it's called.

### `updateSessionData` function: [API Reference](../api-reference/session-object/update-session-data)
```java
Map<String, Object> newData = new HashMap<>();
newData.put("key", "value");
session.updateSessionData(newData);
```
- This function overwrites the current session data stored for this session.
- This function requires a database call each time it's called.

### `revokeSession` function: [API Reference](../api-reference/session-object/revoke-session)
```java
session.revokeSession();
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.


<div class="divider"></div>

### Example
```java
import io.supertokens.javalin.*;

app.before("/test", SuperTokens.middleware());
app.post("/test", ctx -> {
    Session session = SuperTokens.getFromContext(ctx);

    String userId = session.getUserId();

    // update session info
    Map<String, Object> sessionData = session.getSessionData();
    sessionData.put("newKey", 123);
    session.updateSessionData(newSessionData);

    // update jwt payload
    Map<String, Object> payloadData = session.getJWTPayload();
    payloadData.put("newKey", 123);
    session.updateJWTPayload(payloadData);

    // revoking session
    session.revokeSession();

    ctx.result("");
});
```