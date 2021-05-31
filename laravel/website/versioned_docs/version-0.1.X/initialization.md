---
id: version-0.1.X-initialization
title: Initialization
hide_title: true
original_id: initialization
---

# Initialization

From your project directory, run the following command:
```bash
php artisan vendor:publish --tag=supertokens-config
```
This will copy the default SuperTokens config file (`supertokens.php`) to your project's `config` folder.

## Config file
```php
/**
 * e.g.
 * 'hosts' => [[
 *      'hostname' => 'localhost',
 *      'port' => 3567
 * ], [
 *      'hostname' => 'some other domain',
 *      'port' => 8888
 * ]]
 */

return [
    'hosts' => [[
        'hostname' => 'localhost',
        'port' => 3567
    ]]
];
```
- The config allows you to specify the `hostname` and `port` of all the running SuperTokens instances. As you can see, the default is `localhost` and `3567`
- You must specify at least one `hostname` and `port` pair.
- All other configuration can be set in the `config.yaml` file of the SuperTokens service.