---
id: checking-for-active-session
title: Checking if a session exists
hide_title: true
---

# Checking if a session exists

### The ```doesSessionExist``` function: [API Reference](../api-reference/httpurlconnection#supertokensdoessessionexistapplication-applicationcontext)

<!--DOCUSAURUS_CODE_TABS-->
<!--Java-->
```java
SuperTokens.sessionPossiblyExists(getApplicationContext());
```
<!--Kotlin-->
```java
SuperTokens.sessionPossiblyExists(application);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Returns a ```boolean```
- If ```true```: There is an active session.
- If ```false```: There is no active session.

