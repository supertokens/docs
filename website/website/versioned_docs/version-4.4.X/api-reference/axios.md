---
id: version-4.4.X-axios
title: Axios
hide_title: true
original_id: axios
---

# API Reference for Axios

<div class="divider"></div>

## ```init({ refreshTokenUrl, sessionExpiredStatusCode?, websiteRootDomain?, refreshAPICustomHeaders?, autoAddCredentials?})```
#### Parameters
- ```refreshTokenUrl```
    - Type: ```string```
    - Should be the full request URL for your refresh session API endpoint.
    - This function will send a ```POST``` request to it.
- ```sessionExpiredStatusCode``` (Optional)
    - Type: ```number```
    - Default: ```401```
    - HTTP status code that indicates session expiry - as sent by your APIs.
- ```websiteRootDomain``` (Optional)
    - Type: ```string```
    - Default: Same as the domain in the currently loaded URL.
    - Set this to your website domain across which you want to share a session. For example, if your website domain (that is loaded by the user) is ```example.com```, then the value of this should be ```example.com```. If your site has subdomains that need to keep the same session, like ```a.example.com``` and ```b.example.com```, then the value of this should be ```.example.com```.
- ```refreshAPICustomHeaders``` (Optional)
    - Type: ```object```
    - Default: ```{}```
    - If your refresh API requires any custom headers (for example a version number), then you can provide that in this object. An example is: ```{api-version: "0"}```
- ```autoAddCredentials``` (Optional)
    - Type: ```boolean```
    - Default ```true```
    - Setting this to true adds `withCredentials: true` to all requests. This is needed for cross origin requests (website is on `example.com` and API is on `api.example.com`)

#### Returns
- ```void```

#### Throws
- Nothing

<div class="divider"></div>

## ```makeSuper(axios)```
#### Parameters
- ```axios``` instance

#### Returns
- ```void```

#### Throws
- Nothing

<div class="divider"></div>

## ```axios(data, config?)```
#### Parameters
- ```data```
    - Type: ```string``` or ```object```
    - Same as what axios() expects. Either the ```string``` url or the config used to make the API call.
- ```config``` (Optional)
    - Type: ```object```
    - Same as what axios() expects. Config object used to make the API call.

#### Returns
- Identical to the axios API.

#### Throws
- Identical to the axios API.
- An ```Error``` object if the ```init``` function is not called.

<div class="divider"></div>

## ```get(data, config?)``` ```post(data, config?)``` ```delete(data, config?)``` ```put(data, config?)``` 
#### Parameters
- ```data```
    - Type: ```string``` or ```object```
    - Same as what axios() expects. Either the ```string``` url or the config used to make the API call.
- ```config``` (Optional)
    - Type: ```object```
    - Same as what axios() expects. Config object used to make the API call.

#### Returns
- Identical to the axios API.

#### Throws
- Identical to the axios API.
- An ```Error``` object if the ```init``` function is not called.

<div class="divider"></div>

## ```doesSessionExist()```
#### Parameters
- None

#### Returns
- ```boolean```

#### Throws
- Nothing

<div class="divider"></div>

## ```attemptRefreshingSession()```
#### Parameters
- None

#### Returns
- ```Promise<boolean>```

#### Throws
- Identical to an error thrown by axios.
- An ```Error``` object if the ```init``` function is not called.

<div class="divider"></div>

## ```getUserId()```
#### Parameters
- None

#### Returns
- ```string```

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