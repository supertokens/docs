---
id: version-1.2.X-setup
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

## 3) Change SuperTokens configurations
- If using our managed service, then you can change configuration values on your dashboard using the <div class="edit-conf-action-button">Edit configuration</div> button. Instead, if using the self hosted version, please make changes to the [config.yaml file](/docs/pro/configuration/core#optional-config-values).
- Set appropriate values for `cookie_domain` and `refresh_api_path`.
- You can also specify these values via the `supertokens.Config` function mentioned below.

## 4) Specify the location of SuperTokens Service and other configs
- Call this somewhere close to where you initialise the app.
- You can provide multiple addresses in case you are running more than one SuperTokens service (as shown below).
- If using our managed service, you can get the connection information using the <div class="connect-action-button">Connect</div> button on your dashboard. For self hosted, the default location of SuperTokens is `localhost:3567`. If using the trial instance, use `https://try.supertokens.io`.
- You can also specify an API key if you have set one in the `config.yaml` file

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

- All config values (these will override the ones specified in the `config.yaml` file):
    - ```Hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```AccessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```RefreshAPIPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```CookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```CookieSecure: *bool``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```CookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```APIKey``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/pro/configuration/core#optional-config-values)