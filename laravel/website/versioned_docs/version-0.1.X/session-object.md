---
id: version-0.1.X-session-object
title: Session Object
hide_title: true
original_id: session-object
---


# Session Object

A Session object is returned when a session is verified successfully.
```php
$session = SuperTokens\SuperTokens::getSession($request, $response, $enableCsrfProtection);
```

**Following are the functions you can use on this session object:**

### Call the `getUserId` function: [API Reference](./api-reference/session-object/get-user-id)
```php
$session->getUserId()
```
- This function does not do any database call.

### Call the `getJWTPayload` function: [API Reference](./api-reference/session-object/get-jwt-payload)
```php
session->getJWTPayload()
```
- This function does not do any database call.
- It reads the payload available in the JWT access token that was used to verify this session.

### Call the `revokeSession` function: [API Reference](./api-reference/session-object/revoke-session)
```php
session->revokeSession()
```
- Use this to logout a user from their current session.
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.

### Call the `getSessionData` function: [API Reference](./api-reference/session-object/get-session-data)
```php
session->getSessionData()
```
- This function requires a database call each time it's called.

### Call the `updateSessionData` function: [API Reference](./api-reference/session-object/update-session-data)
```php
session->updateSessionData($newData)
```
- This function overrides the current session data stored for this session.
- This function requires a database call each time it's called.

<div class="divider"></div>

### Example
```php
Route::post('/like-comment', function (Illuminate\Http\Request $request) {
    $response = new \Illuminate\Http\Response();
    $session = SuperTokens\SuperTokens::getSession($request, $response, true);

    $userId = $session->getUserId();
    $jwtPayloadData = $session->getJWTPayload();

    //update session info example
    try {
        $sessionData = $session->getSessionData();
        $sessionData["newKey"] = "newValue";
        $session->updateSessionData($sessionData);
    } catch(SuperTokensUnauthorisedException $e) {
        $response->setStatusCode(440)->setContent("Please login again");
    } catch(SuperTokensGeneralException $e) {
        $response->setStatusCode(500)->setContent("Something went wrong");
    }

    try {
        $session->revokeSession();
    } catch(SuperTokensGeneralException $e) {
        $response->setStatusCode(500)->setContent("Something went wrong");
    }

    return $response;
});
```