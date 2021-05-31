---
id: version-1.1.X-okhttp
title: OkHttp
hide_title: true
original_id: okhttp
---

# API Reference for OkHttp

<div class="divider"></div>

## ```SuperTokens.init(Application applicationContext, String refreshTokenEndpoint, Integer sessionExpiryStatusCode, Map<String, String> refreshAPICustomHeaders)```
#### Parameters
- ```applicationContext```
    - The application context for your app.
- ```refreshTokenEndpoint```
    - Should be the full request URL for your refresh session API endpoint.
- ```sessionExpiryStatusCode``` (Nullable)
    - Default: ```401```
    - HTTP status code that indicates session expiry - as sent by your APIs.
- ```refreshAPICustomHeaders``` (Nullable)
    - Default: Empty ```Map```
    - If your refresh API requires any custom headers (for example a version number), then you can provide that in this ```Map```.

#### Returns
- ```void```

#### Throws
- ```MalformedURLException``` if the refreshTokenEndpoint does not start with ```http``` or ```https```, or if it has an invalid format.

<div class="divider"></div>

## ```SuperTokens.doesSessionExist(Application applicationContext)```

#### Parameters
- ```applicationContext```
    - The application context for your app.

#### Returns
- ```boolean```
- ```true``` if there is an existing session, else ```false```

#### Throws
- Nothing
