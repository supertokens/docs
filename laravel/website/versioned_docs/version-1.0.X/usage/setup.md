---
id: version-1.0.X-setup
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

## 3) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK).
```php
Route::middleware("supertokens.middleware")->post("/refresh", function (Request $request) {
    return "";
});
```

## 4) Add error handler
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

## 5) Change SuperTokens `config.yaml`
- Set appropriate values for `cookie_domain` and `refresh_api_path` in the SuperTokens [config.yaml file](/docs/pro/configuration/core#optional-config-values).
- Note that Laravel prepends your routes with `"/api"` by default

## 6) (Optional) Specify the location of SuperTokens Service
- The config file allows you to specify the `hostname` and `port` of all the running SuperTokens instances. The default is `localhost` and `3567`.
- You must specify at least one `hostname` and `port` pair.
- All other configuration can be set in the `config.yaml` file of the SuperTokens service.
```php
// config/supertokens.php

// we want to use two instances of SuperTokens core.
return [
    'hosts' => [[
        'hostname' => 'localhost',
        'port' => 3567
    ], [
        'hostname' => 'example.com',
        'port' => 8080
    ]]
];
```