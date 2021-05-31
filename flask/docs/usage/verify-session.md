---
id: verify-session
title: Verify Session
hide_title: true
---

# Verify Session

### Use `@supertokens_middleware`
```python
supertokens_middleware(enable_csrf_protection)
```
- All APIs that require a valid session must use this middleware.
- If `enable_csrf_protection` is `None`, CSRF protection will be applied to all non-GET and non-OPTIONS APIs automatically.
- If successful, it will create a [session object](./session-object) that can be accessed via `flask.g.supertokens`.
- This uses the [`get_session()`](../api-reference/get-session) function.

<div class="divider"></div>

### Example
```python
from supertokens_flask import supertokens_middleware
from flask import jsonify, g

@app.route('/info')
@supertokens_middleware(True)
def info():
    return jsonify({'userId': g.supertokens.get_user_id()})
```