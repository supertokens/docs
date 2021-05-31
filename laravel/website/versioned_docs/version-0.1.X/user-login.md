---
id: version-0.1.X-user-login
title: User Login
hide_title: true
original_id: user-login
---

# User Login

To login a user, you must first authenticate their credentials and then create a session for them so that they can access your APIs.

### Call the `createNewSession` function: [API Reference](./api-reference/create-new-session)
```php
SuperTokens\SuperTokens::createNewSession($response, $userId, $jwtPayload, $sessionData)
```
- Call this function after you have verified the user credentials.
- This will override any existing session.
- `$jwtPayload` should not contain any sensitive information.

<div class="divider"></div> 

### Example
```php
Route::post('/login', function () {
    // check for user credentials..
    $userId = "User1";
    $jwtPayload = ["name" => "spooky action at a distance"];
    $sessionData = ["awesomeThings" => ["programming", "javascript", "supertokens"]];

    try {
        $response = new \Illuminate\Http\Response();
        $session = SuperTokens\SuperTokens::createNewSession($response, $userId, $jwtPayload, $sessionData);
        return $response;
    } catch (\SuperTokens\Exceptions\SuperTokensGeneralException $err) {
        // handle exception
    }
});
```