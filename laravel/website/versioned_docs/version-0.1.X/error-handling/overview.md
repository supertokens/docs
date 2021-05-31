---
id: version-0.1.X-overview
title: Overview
hide_title: true
original_id: overview
---

# Error Handling Overview

All our functions will throw one of these four types of errors:
- **[SuperTokensGeneralException](./general-error)**
- **[SuperTokensUnauthorisedException](./unauthorised)**
- **[SuperTokensTryRefreshTokenException](./try-refresh-token)**
- **[SuperTokensTokenTheftException](./token-theft-detected)**

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