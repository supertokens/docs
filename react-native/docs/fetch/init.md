---
id: init
title: Initialisation
hide_title: true
---

# Initialisation

### The init function: [API Reference](../api-reference/fetch#init-refreshtokenurl-sessionexpiredstatuscode-viainterceptor-refreshapicustomheaders)

```ts
import SuperTokensRequest from 'supertokens-react-native';

SuperTokensRequest.init({
    refreshTokenUrl: "https://api.example.com/session/refresh"
});
```

- To be called at least once before any http request is made to any of your APIs that require authentication.
- You only need to call this once in your RN app.
- Please see the API reference link above to understand the meaning of the various parameters.