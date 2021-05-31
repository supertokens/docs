---
id: version-1.0.X-session-object
title: Session Object
hide_title: true
original_id: session-object
---


# Session Object

### `getUserId` function: [API Reference](../api-reference/session-object/get-user-id)
```php
let userId = $session->getUserId();
```
- This function does not do any database call.

### `getJWTPayload` function: [API Reference](../api-reference/session-object/get-jwt-payload)
```php
let jwtPayload = $session->getJWTPayload();
```
- This function does not do any database call.

### `updateJWTPayload` function: [API Reference](../api-reference/session-object/update-jwt-payload)
```js
$newData = ["key" => "value"];
$session->updateJWTPayload($newData);
```
- This function will change the current access token
- This function requires a database call each time it's called.

### `getSessionData` function: [API Reference](../api-reference/session-object/get-session-data)
```php
$sessionData = $session->getSessionData();
```
- This function requires a database call each time it's called.

### `updateSessionData` function: [API Reference](../api-reference/session-object/update-session-data)
```php
$newData = ["key" => "value"];
$session->updateSessionData($newData);
```
- This function overwrites the current session data stored for this session.
- This function requires a database call each time it's called.

### `revokeSession` function: [API Reference](../api-reference/session-object/revoke-session)
```php
$session->revokeSession();
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.


<div class="divider"></div>

### Example
```php
Route::middleware("supertokens.middleware")->post("/test", function (Request $request) {
    $session = $request->supertokens;
    
    $userId = $session->getUserId();

    // update session info
    $sessionData = $session->getSessionData();
    $sessionData["newKey"] = "newVal";
    $session->updateSessionData($sessionData);

    // update jwt payload
    $payloadData = $session->getJWTPayload();
    $payloadData["newKey"] = "newVal";
    $session->updateJWTPayload($newPayload);

    // revoking session
    $session->revokeSession();

    return "";
});
```