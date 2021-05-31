---
id: version-1.0.X-handling-cors
title: Handling CORS
hide_title: true
original_id: handling-cors
---

# Handling CORS
<div class="specialNote" style="margin-bottom: 20px">
This section is only applicable to web browser based apps when the website domain is different to the API domain. Differences can be in hostname or in the port number.
</div>

### Call the `setRelevantHeadersForOptionsAPI` function: [API Reference](../api-reference/set-relevant-headers-for-options-api)
```php
\SuperTokens\SuperTokens::setRelevantHeadersForOptionsAPI($resposne);
```
- This is to be called in your ```OPTIONS``` API
- Adds the following headers to the response:
    - `Access-Control-Allow-Headers: "anti-csrf"`
    - `Access-Control-Allow-Headers: "supertokens-sdk-name"`
    - `Access-Control-Allow-Headers: "supertokens-sdk-version"`
    - `Access-Control-Allow-Credentials: true`

> You'll also need to add ```Access-Control-Allow-Credentials``` header with value ```true``` and ```Access-Control-Allow-Origin``` header to your supported origins for all the routes in which you will be using SuperTokens.

<div class="divider"></div>

### Example
```php
use \SuperTokens\SuperTokens;

Route::options("/like-comment", function (Request $request) {
    $res = new \Illuminate\Http\Response();
    $res->header("Access-Control-Allow-Origin", "some-origin.com");
    $res->header("Access-Control-Allow-Methods", "POST");
    SuperTokens::setRelevantHeadersForOptionsAPI($res);
    return $res;
});

Route::middleware("supertokens.middleware")->post('/like-comment', function (Request $request) {
    // API logic...

    $res = new \Illuminate\Http\Response();
    $res->header("Access-Control-Allow-Origin", "some-origin.com");
    $res->header("Access-Control-Allow-Credentials", "true");
    return $res;
});
```