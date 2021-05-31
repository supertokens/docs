---
id: version-1.0.X-init
title: Initialisation
hide_title: true
original_id: init
---

# Initialisation

### 1) Add the ```SuperTokensInterceptor``` to your ```OkHttpClient```
This library provides an ```Interceptor``` to allow simple integration with ```OkHttp``` or ```Retrofit```.

<!--DOCUSAURUS_CODE_TABS-->
<!--OkHttp-->
```java
OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();
clientBuilder.interceptors().add(new SuperTokensInterceptor());
clientBuilder.cookieJar(new PersistentCookieJar(new SetCookieCache(), new SharedPrefsCookiePersistor(context)));  // sets persistent cookies
OkHttpClient client = clientBuilder.build();
```
<!--Retrofit-->
```java
OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();
clientBuilder.interceptors().add(new SuperTokensInterceptor());
clientBuilder.cookieJar(new PersistentCookieJar(new SetCookieCache(), new SharedPrefsCookiePersistor(context)));  // sets persistent cookies
OkHttpClient client = clientBuilder.build();

Retrofit instance = new Retrofit.Builder()
    .baseUrl("YOUR BASE URL")
    .client(client)
    .build();
```
<!--END_DOCUSAURUS_CODE_TABS-->


### 2) Call The ```SuperTokens.init``` function: [API Reference](../api-reference/okhttp#supertokensinitapplication-applicationcontext-string-refreshtokenendpoint-integer-sessionexpirystatuscode-map-string-string-refreshapicustomheaders)
- To be called at least once before any http request is made to any of your APIs that require authentication.
- You only need to call this once in your app.

<!--DOCUSAURUS_CODE_TABS-->
<!--Java-->
```java
import io.supertokens.session.SuperTokens

try {
    SuperTokens.init(getApplication(), "https://api.example.com/api/refresh", 440, null);
} catch (MalformedURLException e) {
    // Refresh URL was invalid
}
```
<!--Kotlin-->
```java
import io.supertokens.session.SuperTokens

try {
    SuperTokens.init(application, "https://api.example.com/api/refreshsession", 440, null);
} catch (MalformedURLException e) {
    // Refresh URL was invalid
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

- To understand the various parameters, please visit the API reference link above.