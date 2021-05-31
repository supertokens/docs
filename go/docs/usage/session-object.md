---
id: session-object
title: Session Object
hide_title: true
---

# Session Object

### `GetUserID` function: [API Reference](../api-reference/session-object/get-user-id)
```go
userId := session.GetUserID()
```
- This function does not do any database call.

### `GetJWTPayload` function: [API Reference](../api-reference/session-object/get-jwt-payload)
```go
jwtPayload := session.GetJWTPayload()
```
- This function does not do any database call.

### `UpdateJWTPayload` function: [API Reference](../api-reference/session-object/update-jwt-payload)
```go
session.UpdateJWTPayload(map[string]interface{}{
    "key": "value",
})
```
- This function will change the current access token
- This function requires a database call each time it's called.

### `GetSessionData` function: [API Reference](../api-reference/session-object/get-session-data)
```go
sessionData := session.GetSessionData()
```
- This function requires a database call each time it's called.

### `UpdateSessionData` function: [API Reference](../api-reference/session-object/update-session-data)
```go
session.UpdateSessionData(map[string]interface{}{
    "key": "value",
})
```
- This function overwrites the current session data stored for this session.
- This function requires a database call each time it's called.

### `RevokeSession` function: [API Reference](../api-reference/session-object/revoke-session)
```go
session.RevokeSession()
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.


<div class="divider"></div>

### Example

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

http.HandleFunc("/test", supertokens.Middleware(func(w http.ResponseWriter, r *http.Request) {
    
    session := supertokens.GetSessionFromRequest(r)
    userID := session.GetUserID()

    // update session info
    err := session.UpdateSessionData(map[string]interface{}{
        "newKey": 123,
    });
    if err != nil {
        supertokens.HandleErrorAndRespond(err, w)
        return
    }

    // update jwt payload
    err = session.UpdateJWTPayload(map[string]interface{}{
        "newKey": 123,
    });
    if err != nil {
        supertokens.HandleErrorAndRespond(err, w)
        return
    }

    // revoking session
    err = session.RevokeSession();
    if err != nil {
        supertokens.HandleErrorAndRespond(err, w)
        return
    }

    w.Write([]byte(userID))
}))
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

r.POST("/test", supertokens.Middleware(), func(c *gin.Context) {
    
    session := supertokens.GetSessionFromRequest(c)
    userID := session.GetUserID()

    // update session info
    err := session.UpdateSessionData(map[string]interface{}{
        "newKey": 123,
    });
    if err != nil {
        supertokens.HandleErrorAndRespond(err, c)
        return
    }

    // update jwt payload
    err = session.UpdateJWTPayload(map[string]interface{}{
        "newKey": 123,
    });
    if err != nil {
        supertokens.HandleErrorAndRespond(err, c)
        return
    }

    // revoking session
    err = session.RevokeSession();
    if err != nil {
        supertokens.HandleErrorAndRespond(err, c)
        return
    }

    c.JSON(http.StatusOK, gin.H{ 
        "userID" : userID, 
    })
})
```
<!--END_DOCUSAURUS_CODE_TABS-->