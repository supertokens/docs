---
id: version-1.2.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum setup (2 mins)

## 1) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK). 
```java
import io.supertokens.javalin.*;

app.before("/refresh", SuperTokens.middleware());
app.post("/refresh", ctx -> {
    ctx.result("");
});
```

## 2) Add an error handler
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom_error_handling) as well.
```java
import io.supertokens.javalin.*;

app.exception(SuperTokensException.class, SuperTokens.exceptionHandler());
```

## 3) Change SuperTokens configurations
- If using our managed service, then you can change configuration values on your dashboard using the <div class="edit-conf-action-button">Edit configuration</div> button. Instead, if using the self hosted version, please make changes to the [config.yaml file](/docs/pro/configuration/core#optional-config-values).
- Set appropriate values for `cookie_domain` and `refresh_api_path`.
- You can also specify these values via the `SuperTokens.config` function mentioned below

## 4) Specify the location of SuperTokens Service and other configs
- Call this somewhere close to where you initialise the app.
- You can provide multiple addresses in case you are running more than one SuperTokens service (as shown below).
- If using our managed service, you can get the connection information using the <div class="connect-action-button">Connect</div> button on your dashboard. For self hosted, the default location of SuperTokens is `localhost:3567`. If using the trial instance, use `https://try.supertokens.com`.
- You can also specify an API key if you have set one in the `config.yaml` file

```java
import io.supertokens.javalin.*;

// ; separated addresses
SuperTokens.config().withHosts("http://localhost:9000;https://try.supertokens.com", "apiKey");
```

- All config values (these will override the ones specified in the `config.yaml` file):
    - ```withHosts(String hosts, String apiKey)``` - `;` separated string for all the locations of SuperTokens instances. An optional apiKey argument.
    - ```withAccessTokenPath(string)``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```withRefreshApiPath(string)``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```withCookieDomain(string)``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```withCookieSecure(boolean)``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```withCookieSameSite(string)``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)