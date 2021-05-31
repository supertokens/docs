---
id: version-0.1.X-refresh-session
title: Refresh Session
hide_title: true
original_id: refresh-session
---

# Refresh Session
This operation is to be done whenever any function throws a `SuperTokensTryRefreshTokenException` error.

### The following are the steps that describe how this works:

- Your frontend calls an API (let's say `/getHomeFeed`) with an access token that has expired.
- In that API, your backend calls the `getSession` function which throws a `SuperTokensTryRefreshTokenException` error.
- Your backend replies with a session expired status code to your frontend.
- Your frontend detects this status code and calls an API on your backend that will refresh the session (let's call this API `/refresh`). Our frontend SDK does this automatically.
- In this API, you call the `refreshSession` function that "refreshes" the session. This will result in the generation of a new access and a new refresh token. The lifetime of these new tokens starts from the point when they were generated.
- Your frontend then calls the `/getHomeFeed` API once again with the new access token yielding a successful response.

### Call the `refreshSession` function: [API Reference](./api-reference/refresh-session)
```php
SuperTokens\SuperTokens::refreshSession($request, $response)
```

- Refreshes the session by generating new access and new refresh tokens.
- If token theft is detected, then it throws a special `SuperTokensTokenTheftException` error. Using this error, you can see who the affected user is and can choose to revoke their affected session.
- This function should only be called in a special POST API endpoint whose only job is to refresh the session. The path to this API will have to be given in the SuperTokens config.yaml so that the refresh token cookie path can be set correctly.

<div class="divider"></div>

### Example
```php
Route::post("/refresh", function (Illuminate\Http\Request $request) {
    $response = new \Illuminate\Http\Response();
    try {
        $session = \SuperTokens\SuperTokens::refreshSession($request, $response);
    } catch(SuperTokensUnauthorisedException $e) {
        $response->setStatusCode(440)->setContent("Please login again");
    } catch(SuperTokensGeneralException $e) {
        $response->setStatusCode(500)->setContent("Something went wrong");
    } catch(\SuperTokens\Exceptions\SuperTokensTokenTheftException $e){
        $affectedUser = $e->getUserId();
        $affectedSessionHandle = $e->getSessionHandle();

        // notify user and revoke all of this user's session or just this session

        $response->setStatusCode(440)->setContent("Token theft detected. Please login again");
    }

    return $response;
});
```