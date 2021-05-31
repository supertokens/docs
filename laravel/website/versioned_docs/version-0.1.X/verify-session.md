---
id: version-0.1.X-verify-session
title: Verify Session
hide_title: true
original_id: verify-session
---

# Verify Session

### Call the `getSession` function: [API Reference](./api-reference/get-session)
```php
SuperTokens\SuperTokens::getSession($request, $response, $enableCsrfProtection)
```
- Use this function at the start of each API call to authenticate the user.
- This will return a `SuperTokens\Session` object. Please see [this](./session-object) section for information with what you can do with this.

> A middleware for this will be available soon.

<div class="divider"></div>

### Example
```php
Route::post('/like-comment', function (Illuminate\Http\Request $request) {
    $response = new \Illuminate\Http\Response();
    try {

        $session = SuperTokens\SuperTokens::getSession($request, $response, true);

        // API logic..

    } catch(SuperTokensTryRefreshTokenException $e) {
        $response->setStatusCode(440)->setContent("Try refresh token");
    } catch (SuperTokensUnauthorisedException $e) {
        $response->setStatusCode(440)->setContent("Please login again");
    } catch(SuperTokensGeneralException $e) {
        $response->setStatusCode(500)->setContent("Something went wrong");
    }
    return $response;
});
```