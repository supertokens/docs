---
id: version-1.0.X-custom_error_handling
title: Custom Error Handling
hide_title: true
original_id: custom_error_handling
---

# Custom Error Handling

There are three types of errors:
- **Unauthorised**: This is when the user has been logged out, or session has expired.
- **Try Refresh Token**: This is when the access token has expired, and you need to refresh the session.
- **Token theft detected**: This is thrown in case a user is being attacked. You can us this to revoke their affected session.

### Define error handlers using the `\SuperTokens\SuperTokens::handleError` function:  [API Reference](../api-reference/error-handling/handle-error)
```php
\SuperTokens\SuperTokens::handleError($request, $exception, [
    'onUnauthorised' => function ($exception, $request, $response) {/* TODO */},
    'onTryRefreshToken' => function ($exception, $request, $response) {/* TODO */},
    'onTokenTheftDetected' => function ($sessionHandle, $userId, $request, $response) {/* TODO */}
]);
```
- All auth cookies are cleared when `onUnauthorised` and `onTokenTheftDetected` is called.
- You should respond with the same session expired HTTP status code for `onUnauthorised` and `onTryRefreshToken`. By default, this value is `440`.
- `$sessionHandle` is like a session identifier (unique per session). Using this, you can revoke this session. Learn more about this [here](./session-handle).
- By default, `onTokenTheftDetected` revokes the affected session and returns the session expired status code.
- **You do not need to provide all the callbacks.**

<div class="divider"></div> 

### Example
```php
// app/Exceptions/Handler.php

use \SuperTokens\SuperTokens;

public function render($request, Throwable $exception) {
    
    try {
        return SuperTokens::handleError($request, $exception, [
            'onUnauthorised' => function ($exception, $request, $response) {
                return $response->setStatusCode(440)->setContent("Please login again");
            },
            'onTryRefreshToken' => function ($exception, $request, $response) {
                return $response->setStatusCode(440)->setContent("Call the refresh API");
            },
            'onTokenTheftDetected' => function ($sessionHandle, $userId, $request, $response) {
                SuperTokens::revokeSession($sessionHandle);
                return $response->setStatusCode(440)->setContent("You are being attacked"); 
            }
        ]);
    } catch (\Exception $err) {
        $exception = $err;
    }

    return parent::render($request, $exception);
}
```