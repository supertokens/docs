---
id: version-1.0.X-session-object
title: Session Object
hide_title: true
original_id: session-object
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
# needs to be called inside an async function
new_data = {"key": "value"}
await session.update_jwt_payload(new_data)
```
- This function will change the current access token
- This function requires a database call each time it's called.

### `get_session_data` function: [API Reference](../api-reference/session-object/get-session-data)
```python
# needs to be called inside an async function
session_data = await session.get_session_data()
```
- This function requires a database call each time it's called.

### `update_session_data` function: [API Reference](../api-reference/session-object/update-session-data)
```python
# needs to be called inside an async function
new_data = {"key": "value"}
await session.update_session_data(new_data)
```
- This function overwrites the current session data stored for this session.
- This function requires a database call each time it's called.

### `revoke_session` function: [API Reference](../api-reference/session-object/revoke-session)
```python
# needs to be called inside an async function
await session.revoke_session()
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.


<div class="divider"></div>

### Example
```python
from supertokens_fastapi import supertokens_session, Session
from fastapi import Depends
from fastapi.responses import JSONResponse

@app.post('/test')
async def test_info(session: Session = Depends(supertokens_session)):
    user_id = session.get_user_id()

    # update session info
    session_data = await session.get_session_data()
    new_session_data = {***session_data, newKey: "newVal"}
    await session.update_session_data(new_session_data)

    # update jwt payload
    payload_data = session.get_jwt_payload()
    new_payload = {...payload_data, newKey: "newVal"}
    await session.update_jwt_payload(new_payload)

    # revoking session
    await session.revoke_session()

    return JSONResponse(content={'status': 'ok'})
```