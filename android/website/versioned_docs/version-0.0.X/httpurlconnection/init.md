---
id: version-0.0.X-init
title: Initialisation
hide_title: true
original_id: init
---

# Initialisation

### The ```SuperTokens.init``` function: [API Reference]()
- To be called at least once before any http request is made to any of your APIs that require authentication.
- You only need to call this once in your app.

<!--DOCUSAURUS_CODE_TABS-->
<!--Java-->
```java
import io.supertokens.session.SuperTokens

try {
    SuperTokens.init(getApplication(), "https://api.example.com/api/refresh", 401, null);
} catch (MalformedURLException e) {
    // Refresh URL was invalid
}
```
<!--Kotlin-->
```kotlin
import io.supertokens.session.SuperTokens

try {
    SuperTokens.init(application, "https://api.example.com/api/refreshsession", 401, null);
} catch (MalformedURLException e) {
    // Refresh URL was invalid
}
```
<!--END_DOCUSAURUS_CODE_TABS-->
