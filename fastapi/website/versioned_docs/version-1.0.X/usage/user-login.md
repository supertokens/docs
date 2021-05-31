---
id: version-1.0.X-user-login
title: User Login
hide_title: true
original_id: user-login
---

# User Login

### Call the `create_new_session` function: [API Reference](../api-reference/create-new-session)
```python
# needs to be called inside an async function
await supertokens_fastapi.create_new_session(request, user_id, jwt_payload, session_data);
```
- `jwt_payload` (type `dict`) should not contain any sensitive information.
- `session_data` (type `dict`) is stored in your database and can contain any information.
- This will attach all relevant cookies and header to the `response` sent by your function.

<div class="divider"></div> 

### Example
```python
from supertokens_fastapi import create_new_session
from fastapi.requests import Request
from fastapi.responses import JSONResponse

@app.post('/login')
async def login(request: Request):
    user_id = 'userId'
    jwt_payload = {'name': 'spooky action at a distance'}
    session_data = {'awesomeThings': ['programming', 'javascript', 'supertokens']}
    
    await create_new_session(request, user_id, jwt_payload, session_data)
    return JSONResponse(content={'userId': user_id}, status_code=200)
```