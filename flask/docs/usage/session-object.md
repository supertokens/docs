---
id: session-object
title: Session Object
hide_title: true
---


# Session Object

### `get_user_id` function: [API Reference](../api-reference/session-object/get-user-id)
```python
user_id = session.get_user_id()
```
- This function does not do any database call.

### `get_jwt_payload` function: [API Reference](../api-reference/session-object/get-jwt-payload)
```python
jwt_payload = session.get_jwt_payload()
```
- This function does not do any database call.

### `update_jwt_payload` function: [API Reference](../api-reference/session-object/update-jwt-payload)
```python
new_data = {"key": "value"}
session.update_jwt_payload(new_data)
```
- This function will change the current access token
- This function requires a database call each time it's called.

### `get_session_data` function: [API Reference](../api-reference/session-object/get-session-data)
```python
session_data = session.get_session_data()
```
- This function requires a database call each time it's called.

### `update_session_data` function: [API Reference](../api-reference/session-object/update-session-data)
```python
new_data = {"key": "value"}
session.update_session_data(new_data)
```
- This function overwrites the current session data stored for this session.
- This function requires a database call each time it's called.

### `revoke_session` function: [API Reference](../api-reference/session-object/revoke-session)
```python
session.revoke_session()
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.


<div class="divider"></div>

### Example
```python
from supertokens_flask import supertokens_middleware
from flask import jsonify, g

@app.route('/test')
@supertokens_middleware(True)
def test_info():
    session = g.supertokens
    user_id = session.get_user_id()

    # update session info
    session_data = session.get_session_data()
    new_session_data = {***session_data, newKey: "newVal"}
    session.update_session_data(new_session_data)

    # update jwt payload
    payload_data = session.get_jwt_payload()
    new_payload = {...payload_data, newKey: "newVal"}
    session.update_jwt_payload(new_payload)

    # revoking session
    session.revoke_session()

    return 'success'
```