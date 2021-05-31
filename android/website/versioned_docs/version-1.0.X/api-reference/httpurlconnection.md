---
id: version-1.0.X-httpurlconnection
title: HttpURLConnection
hide_title: true
original_id: httpurlconnection
---

# API Reference for HttpURLConnection

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

## ```SuperTokensHttpURLConnection.newRequest(URL url, PreConnectCallback preConnectCallback)```
#### Parameters
- ```url```
    - ```URL``` object used to create the ```HttpURLConnection```
- ```preConnectCallback``` (Nullable)
    - Callback that takes as a parameter the ```HttpURLConnection connection``` object. It will be called just before making a request, so it is a suitable place to add custom headers.

#### Returns
- ```HttpURLConnection``` object after a connection has been made.
- You can use the return value to check the status code, and to read the output if relevant.
- Please be sure to close the connection as you normally would.

#### Throws
- ```IllegalAccessException``` if ```SuperTokens.init``` has not been called or if the ```Application``` object provided to the init function is ```null```.
- ```IOException``` if any of the operations on the connection fail.

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
