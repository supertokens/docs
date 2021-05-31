---
id: init
title: Initialisation
hide_title: true
---

# Initialisation

### The ```SuperTokens.init``` function: [API Reference](../api-reference/httpurlconnection#supertokensinitapplication-applicationcontext-string-refreshtokenendpoint-integer-sessionexpirystatuscode-map-string-string-refreshapicustomheaders)
- To be called at least once before any http request is made to any of your APIs that require authentication.
- You only need to call this once in your app.

<!--DOCUSAURUS_CODE_TABS-->
<!--Java-->
```java
import io.supertokens.session.SuperTokens

try {
    SuperTokens.init(getApplication(), "https://api.example.com/session/refresh", 401, null);
} catch (MalformedURLException e) {
    // Refresh URL was invalid
}
```
<!--Kotlin-->
```java
import io.supertokens.session.SuperTokens

try {
    SuperTokens.init(application, "https://api.example.com/session/refresh", 401, null);
} catch (MalformedURLException e) {
    // Refresh URL was invalid
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

- To understand the various parameters, please visit the API reference link above.


## Persisting cookies
SuperTokens does not persist cookies across app launches by default, and relies on you to set a persistent cookie manager for your app. SuperTokens provides a ```SuperTokensPersistentCookieStore``` class which can be used to persist cookies. To enable this cookie store simply use the following code before making any HTTP API calls that require authentication:

```java
CookieManager.setDefault(new CookieManager(new SuperTokensPersistentCookieStore(getApplication()), null));
```
