---
id: version-1.1.X-installation
title: Installation
hide_title: true
original_id: installation
---

# Android SDK Installation

## Add the SuperTokens package dependency
```
implementation 'io.supertokens:session:1.1.+'
```
Add this to your app level ```build.gradle```.

<div class="specialNote" style="margin-bottom: 40px">
This package uses AndroidX artifacts and will break your build if your app does not use them.
</div>

## Additional packages
For SuperTokens to work correctly you need to use cookies in your application:
- When using ```HttpURLConnection``` the library provides a persistent cookie store that you can use. 
- If you use ```OkHttp``` or ```Retrofit``` the library relies on you to set a cookie jar when creating an instance of the ```OkHttpClient```. An example of a library that provides persistent cookie jar is:
    ```
    implementation 'com.github.franmontiel:PersistentCookieJar:+'
    ```