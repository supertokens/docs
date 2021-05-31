---
id: version-1.0.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum setup (2 mins)

## 1) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK).
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

http.HandleFunc("/refresh", supertokens.Middleware(func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("success"))
}))
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

r.POST("/refresh", supertokens.Middleware(), func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{ 
        "msg" : "success", 
    })
}))
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 2) Add error handlers
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom_error_handling) as well.

## 3) Change SuperTokens `config.yaml`
- Set appropriate values for `cookie_domain` and `refresh_api_path` in the SuperTokens [config.yaml file](/docs/pro/configuration/core#optional-config-values).

## 4) (Optional) Specify the location of SuperTokens Service
- Call this somewhere close to where you initialise the app.
- You can provide multiple addresses in case you are running more than one SuperTokens service (as shown below).
- The default location of SuperTokens is `localhost:3567`
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

func main() {
    // ; separated addresses
    supertokens.Config("localhost:9000;192.168.1.2:8080")
}
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

func main() {
    // ; separated addresses
    supertokens.Config("localhost:9000;192.168.1.2:8080")
}
```
<!--END_DOCUSAURUS_CODE_TABS-->