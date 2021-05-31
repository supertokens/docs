---
id: version-1.3.X-setup
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

## 5) Change SuperTokens configurations
- If using our managed service, then you can change configuration values on your dashboard using the <div class="edit-conf-action-button">Edit configuration</div> button. Instead, if using the self hosted version, please make changes to the [config.yaml file](/docs/pro/configuration/core#optional-config-values).
- Set appropriate values for `cookie_domain` and `refresh_api_path`.
- Note that Laravel prepends your routes with `"/api"` by default.
- You can also specify these values via the `config/supertokens.php` file as mentioned below.

## 6) Specify the location of SuperTokens Service
- The config file allows you to specify the `hostname` and `port` of all the running SuperTokens instances. The default is `localhost` and `3567`.
- You can provide multiple addresses in case you are running more than one SuperTokens service (as shown below).
- If using our managed service, you can get the connection information using the <div class="connect-action-button">Connect</div> button on your dashboard. For self hosted, the default location of SuperTokens is `localhost:3567`. If using the trial instance, use `https://try.supertokens.io`.
- You can also specify an API key if you have set one in the `config.yaml` file

```php
// config/supertokens.php

// we want to use two instances of SuperTokens core.
return [
    'hosts' => "http://localhost:3567;https://try.supertokens.io",
    'apiKey' => "key"
];
```

- All config values (these will override the ones specified in the `config.yaml` file):
    - ```hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```accessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```refreshAPIPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSecure: bool``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```apiKey: string``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/pro/configuration/core#optional-config-values) 