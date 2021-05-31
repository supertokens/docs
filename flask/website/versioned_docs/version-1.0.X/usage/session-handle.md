---
id: version-1.0.X-session-handle
title: Session Handle
hide_title: true
original_id: session-handle
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
# get all sessions belonging to a user
session_handles = supertokens_flask.get_all_session_handles_for_user(user_id)
for handle in session_handles:
    # do something with each session
```

## Get and update JWT Payload
```python
jwtPayload = supertokens_flask.get_jwt_payload(session_handle)

supertokens_flask.update_jwt_payload(session_handle, new_jwt_payload)
```

## Get and update session data
```python
session_data = supertokens_flask.get_session_data(session_handle)

supertokens_flask.update_session_data(session_handle, new_session_data)
```

## Revoking a session
```python
# revoke a single session
revoked = supertokens_flask.revoke_session(session_handle)
if revoked:
    # successfully revoked
else:
    # session did not exist
```
```python
# revoke multiple sessions
sessions_revoked = supertokens_flask.revoke_multiple_sessions([session_handle1, session_handle2])
for revoked_handle in sessions_revoked:
    # do something with each revoked sessions
```
```python
# revoke all sessions for a user
sessions_revoked = supertokens_flask.revoke_all_sessions_for_user(user_id)
for revokedHandle in sessions_revoked
    # do something with each revoked sessions
```