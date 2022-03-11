---
id: version-1.4.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum Setup (2 mins)

## 1) Copy the SuperTokens config file
From your project directory, run the following command:
```bash
php artisan vendor:publish --tag=supertokens-config
```
This will copy the default SuperTokens config file (`supertokens.php`) to your project's `config` folder.

## 2) Register SuperTokens middleware
- Add the following in the `$routeMiddleware` array in `app/Http/Kernel.php`
```php
protected $routeMiddleware = [
    // ...other middleware
    'supertokens.middleware' => \SuperTokens\Http\Middleware::class
];
```

## 3) Configure SuperTokens
- Open the `config/supertokens.php` file to add add config values
```php
// config/supertokens.php

return [
    'hosts' => "http://localhost:3567;https://try.supertokens.com",
    'apiKey' => "key"
];
```
- All config values:
    - ```hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```accessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```refreshAPIPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSecure: bool``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```apiKey: string``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/pro/configuration/core#optional-config-values) 
- There are more config values in the `config.yaml` file (for on premise) or on the SaaS dashboard. The values you set via the `init` function above will override those.


## 4) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK).
```php
Route::middleware("supertokens.middleware")->post("/session/refresh", function (Request $request) {
    return "";
});
```

## 5) Add error handler
- **Add this at the start of the `render` function in the `app/Exceptions/Handler.php` file**
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom_error_handling) as well.
```php
use SuperTokens\SuperTokens;

public function render($request, Throwable $exception) {
    
    // add below
    try {
        return SuperTokens::handleError($request, $exception);
    } catch (\Exception $err) {
        $exception = $err;
    }
    // add above

    return parent::render($request, $exception);
}
```