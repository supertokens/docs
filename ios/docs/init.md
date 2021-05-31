---
id: init
title: Initialisation
hide_title: true
---

# Initialisation

## Call the ```SuperTokens.initialise``` function: [API Reference](./api-reference#supertokensinitialiserefreshtokenendpoint-string-sessionexpirystatuscode-int-nil-refreshapicustomheaders-nsdictionary-nsdictionary-throws)
- To be called at least once before any http request is made to any of your APIs that require authentication.
- You only need to call this once in your app.

```swift
import SuperTokensSession

do {
    try SuperTokens.initialise(refreshTokenEndpoint: "http://api.example.com/session/refresh", sessionExpiryStatusCode: 401, refreshAPICustomHeaders: NSDictionary())
} catch SuperTokensError.invalidURL {
    // Invalid URL provided for refresh token
} catch {
    // Unexpected Error
}
```
- To understand the various parameters, please visit the API reference link above.