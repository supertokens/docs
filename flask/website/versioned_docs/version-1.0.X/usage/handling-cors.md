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

### Call the `set_relevant_headers_for_options_api` function: [API Reference](../api-reference/set-relevant-headers-for-options-api)
```js
supertokens_flask.set_relevant_headers_for_options_api(res)
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
```python
from supertokens_flask import supertokens_middleware
from flask import jsonify, g

@app.route('/info', methods=['POST', 'OPTIONS'])
@supertokens_middleware
def info():
    if request.method == 'OPTIONS':
        response = make_response('options api')
        response.headers['Access-Control-Allow-Origin'] = 'some-origin.com'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        set_relevant_headers_for_options_api(response)
        return response
    response = make_response('success', 200)
    response.headers['Access-Control-Allow-Origin'] = 'some-origin.com'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response
```