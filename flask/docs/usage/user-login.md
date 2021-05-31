---
id: user-login
title: User Login
hide_title: true
---

# User Login

### Call the `create_new_session` function: [API Reference](../api-reference/create-new-session)
```python
supertokens_flask.create_new_session(res, user_id, jwt_payload, session_data);
```
- `jwt_payload` (type `dict`) should not contain any sensitive information. This is also be accessible from the frontend.
- `session_data` (type `dict`) is stored in your database and can contain any information.
- This will attach all relevant cookies and header to the `res` object.

<div class="divider"></div> 

### Example
```python
from supertokens_flask import create_new_session
from flask import jsonify, make_response

@app.route('/login')
def login():
    user_id = 'userId'
    jwt_payload = {'name': 'spooky action at a distance'}
    session_data = {'awesomeThings': ['programming', 'javascript', 'supertokens']}
    response = make_response(jsonify({'userId': user_id}), 200)
    create_new_session(response, user_id, jwt_payload, session_data)
    return response
```