---
id: version-2.0.X-supertokens-error-handler
title: supertokens.errorHandler
hide_title: true
original_id: supertokens-error-handler
---

# `supertokens.errorHandler(callbacks?)`
### Parameters
- `callbacks`
    - **type:** [Callbacks](./supertokens-error-handler#callbacks)
    - **description:** If `undefined`, then SuperTokens will resort to its default handlers described below.

### Returns
- `(err, req, res, next) => void`
    - This middleware function will handle all errors generated from SuperTokens.


## Callbacks
```js
supertokens.errorHandler({
    onUnauthorised?: (err, req, res, next) => void,
    onTryRefreshToken?: (err, req, res, next) => void,
    onTokenTheftDetected?: (sessionHandle, userId, req, res, next) => void
});
```

### `onUnauthorised`
- **Default behaviour**: Sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `440`
- All auth cookies are cleared by the time this function is called, even if you do not use the default one.

### `onTryRefreshToken`
- **Default behaviour**: Sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `440`
- No auth cookies are cleared.

### `onTokenTheftDetected`
- **Default behaviour**: Revokes the affected session and sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `440`.
- All auth cookies are cleared by the time this function is called, even if you do not use the default one.