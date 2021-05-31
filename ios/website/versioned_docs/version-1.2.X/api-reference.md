---
id: version-1.2.X-api-reference
title: API Reference
hide_title: true
original_id: api-reference
---

# API Reference for HttpURLConnection

<div class="divider"></div>

## ```SuperTokens.initialise(refreshTokenEndpoint: String, sessionExpiryStatusCode: Int? = nil, refreshAPICustomHeaders: NSDictionary = NSDictionary()) throws```
#### Parameters
- ```refreshTokenEndpoint```
    - Should be the full request URL for your refresh session API endpoint.
    - The library will use this endpoint in case of session expiry.
- ```sessionExpiryStatusCode```
    - Default: ```401```
    - Value for the HTTP Status Code which represents session expiry.
- ```refreshAPICustomHeaders```
    - Default: Empty dictionary
    - If your refresh API requires any custom headers (for example a version number), then you can provide that in this ```NSDictionary```.

#### Returns
- ```void```

#### Throws
- ```SuperTokensError.invalidURL``` if the refreshTokenEndpoint does not start with ```http``` or ```https```, or it has an invalid format.

<div class="divider"></div>

## ```SuperTokensURLSession.dataTask(request: URLRequest, completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void)```

#### Parameters
- ```request```
    - The ```URLRequest``` with which the API call should be made
- ```completionHandler```
    - The callback that will be called with the API result

#### Returns
- Nothing

### Throws
- Nothing

<div class="divider"></div>

## ```SuperTokens.doesSessionExist()```

#### Parameters
- None

#### Returns
- ```Bool```
- ```true``` if there is an existing session, else ```false```

#### Throws
- Nothing
