---
id: verify-session
title: Verify Session
hide_title: true
---

# Verify Session

### Use `supertokens.Middleware()`
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
// doAntiCsrfCheck is optional
supertokens.Middleware(doAntiCsrfCheck ...bool);
```
<!--Gin-->
```go
// doAntiCsrfCheck is optional
supertokens.Middleware(doAntiCsrfCheck ...bool);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- All APIs that require a valid session must use this middleware.
- If `doAntiCsrfCheck` is not provided, CSRF protection will be applied to all non-GET and non-OPTIONS APIs automatically.
- If successful, it will create a [session object](./session-object) that can be accessed via `supertokens.GetSessionFromRequest` function (see code example below).
- This uses the [`GetSession`](../api-reference/get-session) function.

<div class="divider"></div>

### Example

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

http.HandleFunc("/like-comment", supertokens.Middleware(func(w http.ResponseWriter, r *http.Request) {
    
    session := supertokens.GetSessionFromRequest(r)
    userID := session.GetUserID()

    w.Write([]byte(userID))
}))
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

r.POST("/like-comment", supertokens.Middleware(), func(c *gin.Context) {
    
    session := supertokens.GetSessionFromRequest(c)
    userID := session.GetUserID()

    c.JSON(http.StatusOK, gin.H{ 
        "userID" : userID, 
    })
})
```
<!--END_DOCUSAURUS_CODE_TABS-->