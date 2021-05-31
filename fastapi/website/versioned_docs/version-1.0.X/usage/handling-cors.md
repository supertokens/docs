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

### Use the fastapi `CORSMiddleware` library along with `get_cors_allowed_headers` function
- `get_cors_allowed_headers()` returns an array of headers that is used by SuperTokens. These need to go in the `Access-Control-Allow-Headers` header.
- You'll also need to use ```Access-Control-Allow-Credentials``` and ```Access-Control-Allow-Origin```

The above can be achieved easily via the `CORSMiddleware` library as seen below

<div class="divider"></div>

### Example
```python
from fastapi.middleware.cors import CORSMiddleware
from supertokens_fastapi import get_cors_allowed_headers
from fastapi import FastAPI

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type"] + get_cors_allowed_headers(),
)
```