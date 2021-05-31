---
id: version-1.5.X-user-login
title: User Login
hide_title: true
original_id: user-login
---

# User Login

### Call the `createNewSession` function: [API Reference](../api-reference/create-new-session)
```php
SuperTokens\SuperTokens::createNewSession($response, $userId, $jwtPayload, $sessionData)
```
- `$jwtPayload` (type `array`) should not contain any sensitive information. This will also be accessible from the frontend.
- `$sessionData` (type `array`) is stored in your database and can contain any information.
- This will attach all relevant cookies and header to the `$response` object.

<div class="divider"></div> 

### Example
```php
use SuperTokens\SuperTokens;

Route::post('/login', function () {
    $response = new \Illuminate\Http\Response();
    // check for user credentials..

    $userId = "User1";
    $jwtPayload = ["name" => "spooky action at a distance"];
    $sessionData = ["awesomeThings" => ["programming", "javascript", "supertokens"]];

    SuperTokens::createNewSession($response, $userId, $jwtPayload, $sessionData);

    return $response;
});
```