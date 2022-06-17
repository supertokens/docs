---
id: api-reference
title: API Reference
hide_title: true
---

# API Reference

<div class="divider"></div>

## ```init({apiDomain, apiBasePath?, sessionExpiredStatusCode?, cookieDomain?, autoAddCredentials?, isInIframe?, cookieDomain?, override?, onHandleEvent?, preAPIHook?})```
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
- ```cookieDomain``` (Optional)
    - Type: ```string```
    - Default: `undefined`.
    - Set this if you want to share a session across sub domains. For example, if users login via `example.com` and are redirected to a subdomain like `xyz.example.com`, then the value of this should be `".example.com"`.
- ```autoAddCredentials``` (Optional)
    - Type: ```boolean```
    - Default ```true```
    - Setting this to true adds `credentials: "include"` to all requests. This is needed for cross origin requests (website is on `example.com` and API is on `api.example.com`)
- ```isInIframe``` (Optional)
    - Type: ```boolean```
    - Default: ```false```
    - Set this to `true` if your frontend can be used in an iframe. Remember that this means you will have to use `https` for your website domain while in development.
- ```cookieDomain``` (Optional)
    - Type: ```string```
    - Default: ```undefined```
    - This value can be used to enable session management across multiple API sub domains.
- ```override``` (Optional)
    - Type: ```object```
    - Default: ```undefined```
    - Use this to override the default behavior of how sessions is managed on the frontend.
- ```onHandleEvent``` (Optional)
    - Type: ```function```
    - Default: ```undefined```
    - Define this callback to handle events that are fired from this SDK
- ```preAPIHook``` (Optional)
    - Type: ```function```
    - Default: ```undefined```
    - Define this callback to modify requests that are sent to your backend API

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