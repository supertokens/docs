---
id: version-6.0.X-api-reference
title: API Reference
hide_title: true
original_id: api-reference
---

# API Reference

<div class="divider"></div>

## ```init({apiDomain, apiBasePath?, sessionExpiredStatusCode?, sessionScope?, refreshAPICustomHeaders?, signoutAPICustomHeaders?, autoAddCredentials?})```
#### Parameters
- ```apiDomain```
    - Type: ```string```
    - Should be the URL of your API domain.
- ```apiBasePath``` (Optional)
    - Type: ```string```
    - Should be the path in your API domain that is controlled by SuperTokens. The default value is `/auth`. So by default, the SDK will send a `POST` request to `apiDomain + "/auth/session/refresh"` for refreshing a session.
- ```sessionExpiredStatusCode``` (Optional)
    - Type: ```number```
    - Default: ```401```
    - HTTP status code that indicates session expiry - as sent by your APIs.
- ```sessionScope``` (Optional)
    - Type: ```{scope: string, authDomain: string}```
    - Default: `undefined`.
    - Set this if you want to share a session across sub domains. For example, if users login via `example.com` and are redirected to a subdomain like `xyz.example.com`, then the value of this should be `{scope: ".example.com", authDomain: "https://example.com"}`.
- ```refreshAPICustomHeaders``` (Optional)
    - Type: ```object```
    - Default: ```{}```
    - If your refresh API requires any custom headers (for example a version number), then you can provide that in this object. An example is: ```{api-version: "0"}```
- ```signoutAPICustomHeaders``` (Optional)
    - Type: ```object```
    - Default: ```{}```
    - If your sign-out API requires any custom headers (for example a version number), then you can provide that in this object. An example is: ```{api-version: "0"}```
- ```autoAddCredentials``` (Optional)
    - Type: ```boolean```
    - Default ```true```
    - Setting this to true adds `credentials: "include"` to all requests. This is needed for cross origin requests (website is on `example.com` and API is on `api.example.com`)

#### Returns
- ```void```

#### Throws
- Nothing

<div class="divider"></div>

## ```addAxiosInterceptors(axios)```
#### Parameters
- ```axios``` instance

#### Returns
- ```void```

#### Throws
- Nothing

<div class="divider"></div>

## ```doesSessionExist()```
#### Parameters
- None

#### Returns
- ```Promise<boolean>```

#### Throws
- Nothing

<div class="divider"></div>

## ```attemptRefreshingSession()```
#### Parameters
- None

#### Returns
- ```Promise<boolean>```

#### Throws
- Identical to an error thrown by fetch.
- An ```Error``` object if the ```init``` function is not called.

<div class="divider"></div>

## ```getUserId()```
#### Parameters
- None

#### Returns
- ```Promise<string>```

#### Throws
- An ```Error``` object if a session does not exist

<div class="divider"></div>

## ```getJWTPayloadSecurely()```
#### Parameters
- None

#### Returns
- ```Promise<JSON object>```

#### Throws
- An ```Error``` object if reading failed due to:
    - session not existing
    - refreshing failed

<div class="divider"></div>

## ```signOut()```
#### Parameters
- None

#### Returns
- ```Promise<void>```

#### Throws
- An ```Error``` object if response status code is not 2xx and not equal to session expired status code