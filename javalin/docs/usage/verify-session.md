---
id: verify-session
title: Verify Session
hide_title: true
---

# Verify Session

### Use `SuperTokens.middleware()`
```java
SuperTokens.middleware();
SuperTokens.middleware(boolean enableCsrfProtection);
```
- All APIs that require a valid session must use this middleware.
- If `SuperTokens.middleware()` is used, CSRF protection will be applied to all non-GET and non-OPTIONS APIs automatically.
- If successful, it will create a [session object](./session-object) that can be accessed via `SuperTokens.getFromContext(ctx)`.
- This uses the [`getSession`](../api-reference/get-session) function.

<div class="divider"></div>

### Example
```java
import io.supertokens.javalin.*;

app.before("/like-comment", SuperTokens.middleware());
app.post("/like-comment", ctx -> {
    String userId = SuperTokens.getFromContext(ctx).getUserId();
    ctx.result(userId);
});
```