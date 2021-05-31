---
id: version-1.0.X-custom_error_handling
title: Custom Error Handling
hide_title: true
original_id: custom_error_handling
---

# Custom Error Handling

There are three types of errors:
- **Unauthorised**: This is when the user has been logged out, or session has expired.
- **Try Refresh Token**: This is when the access token has expired, and you need to refresh the session.
- **Token theft detected**: This is thrown in case a user is being attacked. You can us this to revoke their affected session.

## Define error handlers
You can define custom error handling functions after initialising the Supertokens app like this:
```python
from supertokens_flask import Supertokens
from flask import Flask

app = Flask(__name__)
supertokens = Supertokens(app)

def handle_unauthrorised_error(e):
    return jsonify({'error_msg': 'unauthrorised'}), 440
supertokens.set_unauthorised_error_handler(handle_unauthrorised_error)

def handle_try_refresh_token_error(e):
    return jsonify({'error_msg': 'try refresh token'}), 440
supertokens.set_try_refresh_token_error_handler(handle_try_refresh_token_error)

def set_token_theft_detected_error_handler(session_handle, user_id):
    return jsonify({'error_msg': 'token theft'}), 440
supertokens.set_token_theft_detected_error_handler(handle_try_refresh_token_error)
```

- All auth cookies are cleared when [`SuperTokensUnauthorisedError`](../api-reference/error-handling/unauthorised) and [`SuperTokensTokenTheftError`](../api-reference/error-handling/token-theft-detected) are thrown.
- You should respond with the same session expired HTTP status code in function you set for `set_unauthorised_error_handler` and `set_try_refresh_token_error_handler`. By default, this value is `440`.
- `session_handle` is like a session identifier (unique per session). Using this, you can revoke this session. Learn more about this [here](./session-handle).
- By default, whenever [`SuperTokensTokenTheftError`](../api-reference/error-handling/token-theft-detected) is thrown, the affected session is revoked.
- Refer this [link](../api-reference/error-handling/handle-error) to know what parameters are you should accept for the callback functions you define.
- **You do not need to provide all the callbacks.**