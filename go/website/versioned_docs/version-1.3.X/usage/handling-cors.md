---
id: version-1.3.X-handling-cors
title: Handling CORS
hide_title: true
original_id: handling-cors
---

# Handling CORS
<div class="specialNote" style="margin-bottom: 20px">
This section is only applicable to web browser based apps when the website domain is different to the API domain. Differences can be in hostname or in the port number.
</div>

### Use a CORS library along with `GetCORSAllowedHeaders` function
- `GetCORSAllowedHeaders()` returns an array of headers that is used by SuperTokens. These need to go in the `Access-Control-Allow-Headers` header.
- You'll also need to use ```Access-Control-Allow-Credentials``` and ```Access-Control-Allow-Origin```

The above can be achieved easily via a CORS library as seen below

<div class="divider"></div>

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import (
    "github.com/supertokens/supertokens-go/supertokens"
    "github.com/gorilla/handlers"
)

// allow headers 
// allow relevant http methods
// allow relevant origins
// allow credentials

http.ListenAndServe("0.0.0.0:8080", handlers.CORS(
		handlers.AllowedHeaders(append([]string{"Content-Type"}, supertokens.GetCORSAllowedHeaders()...)),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"http://127.0.0.1:8080"}),
		handlers.AllowCredentials(),
	)(r))
```
<!--Gin-->
```go
import (
    "github.com/supertokens/supertokens-go/gin/supertokens"
    "github.com/gin-contrib/cors"
)

// allow headers 
// allow relevant http methods
// allow relevant origins
// allow credentials

r := gin.Default()
r.Use(cors.New(cors.Config{
    AllowHeaders:     append([]string{"Content-Type"}, supertokens.GetCORSAllowedHeaders()...),
    AllowMethods:     []string{"GET", "POST", "PUT", "HEAD", "OPTIONS"},
    AllowOrigins:     []string{"http://127.0.0.1:8080"},
    AllowCredentials: true,
}))
```
<!--END_DOCUSAURUS_CODE_TABS-->