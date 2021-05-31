---
id: version-1.0.X-handling-cors
title: Handling CORS
hide_title: true
original_id: handling-cors
---

# Handling CORS
<div class="specialNote" style="margin-bottom: 20px">
This section is only applicable to web browser based apps when the website domain is different to the API domain. Differences can be in hostname or in the port number.
</div>

### Call the `SetRelevantHeadersForOptionsAPI` function: [API Reference](../api-reference/set-relevant-headers-for-options-api)

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
supertokens.SetRelevantHeadersForOptionsAPI(w http.ResponseWriter);
```
<!--Gin-->
```go
supertokens.SetRelevantHeadersForOptionsAPI(c *gin.Context);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- This is to be called in your ```OPTIONS``` API
- Adds the following headers to the response:
    - `Access-Control-Allow-Headers: "anti-csrf"`
    - `Access-Control-Allow-Headers: "supertokens-sdk-name"`
    - `Access-Control-Allow-Headers: "supertokens-sdk-version"`
    - `Access-Control-Allow-Credentials: true`

> You'll also need to add ```Access-Control-Allow-Credentials``` header with value ```true``` and ```Access-Control-Allow-Origin``` header to your supported origins for all the routes in which you will be using SuperTokens.

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

http.HandleFunc("/like-comment", supertokens.Middleware(func(w http.ResponseWriter, r *http.Request) {

    if r.Method == "OPTIONS" {
        w.Header().Set("Access-Control-Allow-Origin", "some-origin.com")
        w.Header().Set("Access-Control-Allow-Methods", "POST")
        supertokens.SetRelevantHeadersForOptionsAPI(w)
        w.Write([]byte(""))
    } else {
        // ...API logic

        w.Header().Set("Access-Control-Allow-Origin", "some-origin.com")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Write([]byte("success"))
    }
}))
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

r.OPTIONS("/like-comment", func(c *gin.Context) {
    c.Writer.Header().Set("Access-Control-Allow-Origin", "some-origin.com")
    c.Writer.Header().Set("Access-Control-Allow-Methods", "POST")
    supertokens.SetRelevantHeadersForOptionsAPI(c)
    c.Writer.Write([]byte(""))
})

r.POST("/like-comment", supertokens.Middleware(), func(c *gin.Context) {
    // ...API logic

    c.Writer.Header().Set("Access-Control-Allow-Origin", "some-origin.com")
    c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
    c.Writer.Write([]byte("success"))
})
```
<!--END_DOCUSAURUS_CODE_TABS-->