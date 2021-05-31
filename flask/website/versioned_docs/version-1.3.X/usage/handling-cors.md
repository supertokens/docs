---
id: version-1.3.X-handling-cors
title: Handling CORS
hide_title: true
original_id: handling-cors
---

# Handling CORS
<div class="specialNote" style="margin-bottom: 20px">
This section is only applicable to web browser based apps when the website domain is different to the API domain. Differences can be in hostname or in the port number.
</div>

### Use the flask `CORS` library along with `get_cors_allowed_headers` function
- `get_cors_allowed_headers()` returns an array of headers that is used by SuperTokens. These need to go in the `Access-Control-Allow-Headers` header.
- You'll also need to use ```Access-Control-Allow-Credentials``` and ```Access-Control-Allow-Origin```

The above can be achieved easily via the `CORS` library as seen below


<div class="divider"></div>

### Example
```python
from supertokens_flask import (
    get_cors_allowed_headers

from flask_cors import CORS

app = Flask(__name__, static_url_path='')

CORS(app, supports_credentials=True, origins=["http://127.0.0.1:8080"],
     allow_headers=["Content-Type"] + get_cors_allowed_headers())
```