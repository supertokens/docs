---
id: version-1.0.X-init
title: Initialisation
hide_title: true
original_id: init
---

# Initialisation

### The init function: [API Reference](../api-reference/fetch#initrefreshtokenurl-sessionexpiredstatuscode-viainterceptor-refreshapicustomheaders)

```ts
import SuperTokensRequest from 'supertokens-react-native';

SuperTokensRequest.init("https://api.example.com/api/refresh", 440, true, {});
```

- To be called at least once before any http request is made to any of your APIs that require authentication.
- You only need to call this once in your RN app.
- Please see the API reference link above to understand the meaning of the various parameters.