---
id: version-0.1.X-user-logout
title: User Logout
hide_title: true
original_id: user-logout
---

# User Logout
Logging out a user from a particular device can be done via revoking that user session

Please see the [Session Object](./api-reference/session-object/overview) section for more information

<div class="divider"></div>

### Example
```php
Route::post("/logout", function (Illuminate\Http\Request $request) {
    // first we verify the session.
    $session = null;
    $response = new \Illuminate\Http\Response();
    try {
        $session = SuperTokens\SuperTokens::getSession($request, $response, true);
    } catch (SuperTokensUnauthorisedException $e) {

        // this means the session does not exist. So they are already logged out.
        return $response.setStatusCode(200).setContent("Successful logout");
    } catch ($err) {
        // See verify session page to handle errors here.
    }

    // now we revoke this session.
    try {
        $session->revokeSession();
        return $response.setStatusCode(200).setContent("Successful logout");
    } catch (SuperTokensGeneralException $e) {
        return $response.setStatusCode(500).setContent("Something went wrong");
    }
});

```