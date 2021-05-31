---
id: version-1.0.X-user-login
title: User Login
hide_title: true
original_id: user-login
---

# User Login

### Call the `CreateNewSession` function: [API Reference](../api-reference/create-new-session)
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
supertokens.CreateNewSession(w http.ResponseWriter, userID string) (supertokens.Session, error)
```
<!--Gin-->
```go
supertokens.CreateNewSession(c *c.Context, userID string) (supertokens.Session, error)
```
<!--END_DOCUSAURUS_CODE_TABS-->

- This will attach all relevant cookies and header to the response.

### Add JWT payload
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
// jwtPayload is a map[string]interface{}
supertokens.CreateNewSession(w, "user1", jwtPayload)
```
<!--Gin-->
```go
// jwtPayload is a map[string]interface{}
supertokens.CreateNewSession(c, "user1", jwtPayload)
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `jwtPayload` should not contain any sensitive information.

### Add session data
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
// jwtPayload is nil here
// sessionData is a map[string]interface{}
supertokens.CreateNewSession(w, "user1", nil, sessionData)
```
<!--Gin-->
```go
// jwtPayload is nil here
// sessionData is a map[string]interface{}
supertokens.CreateNewSession(c, "user1", nil, sessionData)
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `sessionData` is stored in your database and can contain any information.

<div class="divider"></div> 

### Example

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
    // ...check for user credentials

    userID := "user1"

    jwtPayload := map[string]interface{}{
        "role": "admin",
    }

    sessionData := map[string]interface{}{
        "awesomeThings": "programming",
    }

    session, err := supertokens.CreateNewSession(w, userID, jwtPayload, sessionData)
    if err != nil {
        supertokens.HandleErrorAndRespond(err, w)
        return
    }

    w.Write([]byte("login successful: " + session.GetUserID()))

})
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

r.POST("/login", func(c *gin.Context) {
    // ...check for user credentials

    userID := "user1"

    jwtPayload := map[string]interface{}{
        "role": "admin",
    }

    sessionData := map[string]interface{}{
        "awesomeThings": "programming",
    }

    session, err := supertokens.CreateNewSession(c, userID, jwtPayload, sessionData)

    if err != nil {
        supertokens.HandleErrorAndRespond(err, c)
        return
    }

    c.JSON(http.StatusOK, gin.H{ 
        "msg": "login successful: " + session.GetUserID(), 
    })

})
```
<!--END_DOCUSAURUS_CODE_TABS-->