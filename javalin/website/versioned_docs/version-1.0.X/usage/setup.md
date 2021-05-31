---
id: version-1.0.X-setup
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

## 3) Change SuperTokens `config.yaml`
- Set appropriate values for `cookie_domain` and `refresh_api_path` in the SuperTokens [config.yaml file](/docs/pro/configuration/core#optional-config-values).

## 4) (Optional) Specify the location of SuperTokens Service
- Call this somewhere close to where you initialise the app.
- You can provide multiple addresses in case you are running more than one SuperTokens service (as shown below).
- The default location of SuperTokens is `localhost:3567`
```java
import io.supertokens.javalin.*;

// ; separated addresses
SuperTokens.config("localhost:9000;192.168.1.2:8080");
```