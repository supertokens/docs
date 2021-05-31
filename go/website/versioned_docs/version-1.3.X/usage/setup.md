---
id: version-1.3.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum setup (2 mins)

## 1) Initialise SuperTokens
- Initialize SuperTokens by calling the `Config` function
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

func main() {
    // ; separated addresses
    supertokens.Config(supertokens.ConfigMap{
        Hosts:  "http://localhost:9000;https://try.supertokens.io",
        APIKey: "key",
    })
}
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

func main() {
    // ; separated addresses
    supertokens.Config(supertokens.ConfigMap{
        Hosts:  "http://localhost:9000;https://try.supertokens.io",
        APIKey: "key",
    })
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

- All config values:
    - ```Hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```AccessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```RefreshAPIPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```CookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```CookieSecure: *bool``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```CookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```APIKey``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/pro/configuration/core#optional-config-values)
- There are more config values in the `config.yaml` file (for on premise) or on the SaaS dashboard. The values you set via the `init` function above will override those.

## 2) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK).
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

http.HandleFunc("/session/refresh", supertokens.Middleware(func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("success"))
}))
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

r.POST("/session/refresh", supertokens.Middleware(), func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{ 
        "msg" : "success", 
    })
}))
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 3) Add error handlers
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom_error_handling) as well.
