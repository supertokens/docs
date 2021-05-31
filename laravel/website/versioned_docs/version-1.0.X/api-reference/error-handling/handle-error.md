---
id: version-1.0.X-handle-error
title: handleError
hide_title: true
original_id: handle-error
---

# `handleError($request, $exception, $callbacks = null)`
### Parameters
- `$request`
    - **type:** `\Illuminate\Http\Request`
- `$exception`
    - **type:** `\Exception` 
- `callbacks` **(Optional)**
    - **type:** [Callbacks](./handle-error#callbacks)
    - **description:** If `null`, then SuperTokens will resort to its default handlers described below.

### Returns
- `\Illuminate\Http\Response` that can be sent to the client

### Throws
- `\Exception` if the given `$exception` is not a SuperTokens error, or is of type [`SuperTokensGeneralException`](./general-error)


# Callbacks
```php
\SuperTokens\SuperTokens::handleError($request, $exception, [
    'onUnauthorised' => function ($exception, $request, $response) {/* TODO */},
    'onTryRefreshToken' => function ($exception, $request, $response) {/* TODO */},
    'onTokenTheftDetected' => function ($sessionHandle, $userId, $request, $response) {/* TODO */}
]);
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