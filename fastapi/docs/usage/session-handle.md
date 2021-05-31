---
id: session-handle
title: Session Handle
hide_title: true
---

# Session Handle

Each session has a unique identifier which stays constant until the end of the session. This is not the access, nor the refresh token, it is merely a "handle" to the session, hence the name.

Please see the API reference to learn more about the functions used below.

## Obtaining a session's handle
```python
# get session handle of the current request
handle = session.get_session_handle()
```
```python
# get all sessions belonging to a user, needs to be called inside an async function
session_handles = await supertokens_fastapi.get_all_session_handles_for_user(user_id)
for handle in session_handles:
    # do something with each session
```

## Get and update JWT Payload
```python
# needs to be called inside an async function
jwtPayload = await supertokens_fastapi.get_jwt_payload(session_handle)

supertokens_fastapi.update_jwt_payload(session_handle, new_jwt_payload)
```

## Get and update session data
```python
# needs to be called inside an async function
session_data = await supertokens_fastapi.get_session_data(session_handle)

supertokens_fastapi.update_session_data(session_handle, new_session_data)
```

## Revoking a session
```python
# revoke a single session, needs to be called inside an async function
revoked = await supertokens_fastapi.revoke_session(session_handle)
if revoked:
    # successfully revoked
else:
    # session did not exist
```
```python
# revoke multiple sessions, needs to be called inside an async function
sessions_revoked = await supertokens_fastapi.revoke_multiple_sessions([session_handle1, session_handle2])
for revoked_handle in sessions_revoked:
    # do something with each revoked sessions
```
```python
# revoke all sessions for a user, needs to be called inside an async function
sessions_revoked = await supertokens_fastapi.revoke_all_sessions_for_user(user_id)
for revokedHandle in sessions_revoked
    # do something with each revoked sessions
```