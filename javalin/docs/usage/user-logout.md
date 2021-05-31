---
id: user-logout
title: Logout / Revoke Session
hide_title: true
---

# Logout / Revoke Session

### `revokeSession` function: [API Reference](../api-reference/session-object/revoke-session)
```java
session.revokeSession()
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.

<div class="divider"></div>

### Example
```java
import io.supertokens.javalin.*;

app.before("/logout", SuperTokens.middleware());
app.use("/logout", ctx -> {
    SuperTokens.getFromContext(ctx).revokeSession();
    ctx.result("Success! Go to login page");
});
```