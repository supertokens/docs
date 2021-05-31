---
id: version-1.0.X-custom_error_handling
title: Custom Error Handling
hide_title: true
original_id: custom_error_handling
---

# Custom Error Handling

There are four types of errors:
- **UnauthorizedError**: This is when the user has been logged out, or session has expired.
- **TryRefreshTokenError**: This is when the access token has expired, and you need to refresh the session.
- **TokenTheftDetectedError**: This is thrown in case a user is being attacked. You can us this to revoke their affected session.
- **GeneralError**: This is thrown in case of any general error like failure when connecting to the SuperTokens core service.

## Define custom error handlers
```go
supertokens.OnUnauthorized(func(err error, w http.ResponseWriter) {
    // TODO:
})
supertokens.OnTryRefreshToken(func(err error, w http.ResponseWriter) {
    // TODO:
})
supertokens.OnTokenTheftDetected(func(sessionHandle string, userID string, w http.ResponseWriter) {
    // TODO:
})
supertokens.OnGeneralError(func(err error, w http.ResponseWriter) {
    // TODO:
})
```

- All auth cookies are cleared when `OnUnauthorized` and `OnTokenTheftDetected` are called.
- You should respond with the same session expired HTTP status code for `OnUnauthorized` and `OnTryRefreshToken`. By default, this value is `440`.
- By default, `OnTokenTheftDetected` revokes the affected session and returns the session expired status code. Learn more about session handles [here](./session-handle).
- **You do not need to provide all theses callbacks.**

<div class="divider"></div> 

### Example

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
```go
import "github.com/supertokens/supertokens-go/supertokens"

func main() {
    supertokens.OnUnauthorized(func(err error, w http.ResponseWriter) {
        w.WriteHeader(440)
        w.Write([]byte("Unauthorized: " + err.Error()))
    })
    supertokens.OnTryRefreshToken(func(err error, w http.ResponseWriter) {
        w.WriteHeader(440)
        w.Write([]byte("Call the refresh API"))
    })
    supertokens.OnTokenTheftDetected(func(sessionHandle string, userID string, w http.ResponseWriter) {
        w.WriteHeader(440)
	    w.Write([]byte("token theft detected"))
	    _, _ = supertokens.RevokeSession(sessionHandle)
    })
    supertokens.OnGeneralError(func(err error, w http.ResponseWriter) {
        w.WriteHeader(500)
	    w.Write([]byte("Internal error: " + err.Error()))
    })
}
```
<!--Gin-->
```go
import "github.com/supertokens/supertokens-go/gin/supertokens"

func main() {
    supertokens.OnUnauthorized(func(err error, w http.ResponseWriter) {
        w.WriteHeader(440)
        w.Write([]byte("Unauthorized: " + err.Error()))
    })
    supertokens.OnTryRefreshToken(func(err error, w http.ResponseWriter) {
        w.WriteHeader(440)
        w.Write([]byte("Call the refresh API"))
    })
    supertokens.OnTokenTheftDetected(func(sessionHandle string, userID string, w http.ResponseWriter) {
        w.WriteHeader(440)
	    w.Write([]byte("token theft detected"))
	    _, _ = supertokens.RevokeSession(sessionHandle)
    })
    supertokens.OnGeneralError(func(err error, w http.ResponseWriter) {
        w.WriteHeader(500)
	    w.Write([]byte("Internal error: " + err.Error()))
    })
}
```
<!--END_DOCUSAURUS_CODE_TABS-->