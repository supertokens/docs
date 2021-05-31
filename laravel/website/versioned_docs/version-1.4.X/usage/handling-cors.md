---
id: version-1.4.X-handling-cors
title: Handling CORS
hide_title: true
original_id: handling-cors
---

# Handling CORS
<div class="specialNote" style="margin-bottom: 20px">
This section is only applicable to web browser based apps when the website domain is different to the API domain. Differences can be in hostname or in the port number.
</div>

### Use the `getCORSAllowedHeaders` function
- `getCORSAllowedHeaders()` returns an array of headers that is used by SuperTokens. These need to go in the `Access-Control-Allow-Headers` header.
- You'll also need to use ```Access-Control-Allow-Credentials``` and ```Access-Control-Allow-Origin```

The above can be achieved easily via the `config/cors.php` file

<div class="divider"></div>

### Example
```php
<?php

use SuperTokens\SuperTokens;

// Important:
// - allowed_origins
// - allowed_headers
// - supports_credentials

return [
    'paths' => ['*'],

    'allowed_methods' => ['GET', 'POST', 'DELETE'],

    'allowed_origins' => ['http://127.0.0.1:8080'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => array_merge(['Content-Type'], SuperTokens::getCORSAllowedHeaders()),

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];

```