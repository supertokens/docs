---
id: user-logout
title: Logout / Revoke Session
hide_title: true
---

# Logout / Revoke Session

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

http.HandleFunc("/logout", supertokens.Middleware(func(w http.ResponseWriter, r *http.Request) {
    
    session := supertokens.GetSessionFromRequest(r)
    err := session.RevokeSession()
    if err != nil {
        supertokens.HandleErrorAndRespond(err, w)
        return
    }

    w.Write([]byte("Logout successful"))
}))
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

r.POST("/logout", supertokens.Middleware(), func(c *gin.Context) {
    
    session := supertokens.GetSessionFromRequest(c)
    err := session.RevokeSession()
    if err != nil {
        supertokens.HandleErrorAndRespond(err, c)
        return
    }

    c.JSON(http.StatusOK, gin.H{ 
        "msg" : "Logout successful", 
    })
})
```
<!--END_DOCUSAURUS_CODE_TABS-->