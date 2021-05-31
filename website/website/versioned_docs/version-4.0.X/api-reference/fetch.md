---
id: version-4.0.X-fetch
title: Fetch
hide_title: true
original_id: fetch
---

# API Reference for Fetch

<div class="divider"></div>

## ```init(refreshTokenUrl, sessionExpiredStatusCode?, viaInterceptor?, websiteRootDomain?, refreshAPICustomHeaders?)```
#### Parameters
- ```refreshTokenUrl```
    - Type: ```string```
    - Should be the full request URL for your refresh session API endpoint.
    - This function will send a ```POST``` request to it.
- ```sessionExpiredStatusCode``` (Optional)
    - Type: ```number```
    - Default: ```440```
    - HTTP status code that indicates session expiry - as sent by your APIs.
- ```viaInterceptor``` (Optional)
    - Type: ```boolean```
    - Default: ```false```
    - If ```true```, all network calls made using fetch are intercepted.
- ```websiteRootDomain``` (Optional)
    - Type: ```string```
    - Default: Same as the domain in the currently loaded URL.
    - Set this to your website domain across which you want to share a session. For example, if your website domain (that is loaded by the user) is ```example.com```, then the value of this should be ```example.com```. If your site has subdomains that need to keep the same session, like ```a.example.com``` and ```b.example.com```, then the value of this should be ```.example.com```.
- ```refreshAPICustomHeaders``` (Optional)
    - Type: ```object```
    - Default: ```{}```
    - If your refresh API requires any custom headers (for example a version number), then you can provide that in this object. An example is: ```{api-version: "0"}```

#### Returns
- ```void```

#### Throws
- Nothing

<div class="divider"></div>

## ```fetch(url, config?)```
#### Parameters
- ```url```
    - Type: ```string```
    - Same as what fetch expects.
- ```config``` (Optional)
    - Type: ```object```
    - Same as what fetch expects.

#### Returns
- Identical to the fetch API.

#### Throws
- Identical to the fetch API.
- An ```Error``` object if the ```init``` function is not called.

<div class="divider"></div>

## ```get(url, config?)``` ```post(url, config?)``` ```delete(url, config?)``` ```put(url, config?)``` 
#### Parameters
- ```url```
    - Type: ```string```
    - Same as what fetch expects.
- ```config``` (Optional)
    - Type: ```object```
    - Same as what fetch expects.

#### Returns
- Identical to the fetch API.

#### Throws
- Identical to the fetch API.
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
- Identical to an error thrown by fetch.
- An ```Error``` object if the ```init``` function is not called.
