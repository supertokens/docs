---
id: version-1.0.X-custom_error_handling
title: Custom Error Handling
hide_title: true
original_id: custom_error_handling
---

# Custom Error Handling

There are four types of errors:
- **UnauthorisedException**: This is when the user has been logged out, or session has expired.
- **TryRefreshTokenException**: This is when the access token has expired, and you need to refresh the session.
- **TokenTheftDetectedException**: This is thrown in case a user is being attacked. You can us this to revoke their affected session.
- **GeneralException**: This is thrown in case of any general error like failure when connecting to the SuperTokens core service.

## Define error handlers using the `SuperTokens.exceptionHandler()` function
```java
app.exception(SuperTokensException.class, SuperTokens.exceptionHandler()
    .onTryRefreshTokenError((exception, ctx) -> {
        // TODO:
    })
    .onUnauthorisedError((exception, ctx) -> {
        // TODO:
    })
    .onGeneralError(((exception, ctx) -> {
        // TODO:
    })
    .onTokenTheftDetectedError((exception, ctx) -> {
        // TODO:                    
    })
);
```
- All auth cookies are cleared when `onUnauthorisedError` and `onTokenTheftDetectedError` is called.
- You should respond with the same session expired HTTP status code for `onUnauthorisedError` and `onTryRefreshTokenError`. By default, this value is `440`.
- By default, `onTokenTheftDetectedError` revokes the affected session and returns the session expired status code. In this function, you can use `exception.getUserId()` and 
`exception.getSessionHandle()` to get the affected user and session. Learn more about session handles [here](./session-handle).
- **You do not need to provide all theses callbacks.**

<div class="divider"></div> 

### Example
```java
import io.supertokens.javalin.*;

app.exception(SuperTokensException.class, SuperTokens.exceptionHandler()
    .onTryRefreshTokenError((exception, ctx) -> {
        ctx.status(440).result("Call the refresh API");
    })
    .onUnauthorisedError((exception, ctx) -> {
        ctx.status(440).result("Please login again");
    })
    .onGeneralError(((exception, ctx) -> {
        ctx.status(440).result(exception.getMessage());
    })
    .onTokenTheftDetectedError((exception, ctx) -> {
        ctx.status(440).result("You are being attacked");  

        // revoke affected session.   
        try {
            SuperTokens.revokeSession(exception.getSessionHandle());  
        } catch (GeneralException e) {
            e.printStackTrace();
        }
    })
);
```