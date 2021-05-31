---
id: version-1.0.X-user-login
title: User Login
hide_title: true
original_id: user-login
---

# User Login

### Call the `newSession` function: [API Reference](../api-reference/new-session)
```java
SuperTokens.newSession(ctx, userId).create();
```
- This will attach all relevant cookies and header to the `res` object.

### Add session data
```java
// sessionData is a Map<String, Object>
SuperTokens.newSession(ctx, userId).withSessionData(sessionData).create();
```
- `sessionData` is stored in your database and can contain any information.

### Add JWT payload
```java
// jwtPayload is a Map<String, Object>
SuperTokens.newSession(ctx, userId).withJWTPayload(jwtPayload).create();
```
- `jwtPayload` should not contain any sensitive information.

<div class="divider"></div> 

### Example

```java
import io.supertokens.javalin.*;

app.post("/login", ctx -> {
    // ...check for user credentials

    String userId = "User1";
    
    Map<String, Object> jwtPayload = new HashMap<>();
    jwtPayload.put("role", "admin");

    Map<String, Object> sessionData = new HashMap<>();
    sessionData.put("awesomeThings", "programming");

    SuperTokens.newSession(ctx, userId).withSessionData(sessionData)
        .withJWTPayload(jwtPayload).create();
    
    ctx.result("logged in");
});
```