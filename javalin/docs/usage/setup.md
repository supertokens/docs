---
id: setup
title: Minimum setup
hide_title: true
---

# Minimum setup (2 mins)

## 1) Initialise SuperTokens
- Add the following `config` near the start of your app
```java
import io.supertokens.javalin.*;

// ; separated addresses
SuperTokens.config().withHosts("http://localhost:9000;https://try.supertokens.com", "apiKey");
```

- All config values:
    - ```withHosts(String hosts, String apiKey)``` - `;` separated string for all the locations of SuperTokens instances. An optional apiKey argument.
    - ```withAccessTokenPath(string)``` - See `access_token_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```withRefreshApiPath(string)``` - See `refresh_api_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```withCookieDomain(string)``` - See `cookie_domain` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```withCookieSecure(boolean)``` - See `cookie_secure` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```withCookieSameSite(string)``` - See `cookie_same_site` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
- There are more config values in the `config.yaml` file (for on premise) or on the SaaS dashboard. The values you set via the `init` function above will override those.

## 2) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK). 
```java
import io.supertokens.javalin.*;

app.before("/session/refresh", SuperTokens.middleware());
app.post("/session/refresh", ctx -> {
    ctx.result("");
});
```

## 3) Add an error handler
- Add the following at the end of your routes
```java
import io.supertokens.javalin.*;

app.exception(SuperTokensException.class, SuperTokens.exceptionHandler());
```
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom_error_handling) as well.