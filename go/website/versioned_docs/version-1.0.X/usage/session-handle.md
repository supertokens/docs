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
```go
// get session handle of the current request
handle := session.GetHandle()
```
```go
// get all sessions belonging to a user
sessionHandles, err := supertokens.GetAllSessionHandlesForUser(userId)
```

## Get and update JWT Payload
```go
jwtPayload, err := supertokens.GetJWTPayload(sessionHandle)

err = supertokens.UpdateJWTPayload(sessionHandle, map[string]interface{}{
    "key": "value",
})
```

## Get and update session data
```go
jwtPayload, err := supertokens.GetSessionData(sessionHandle)

err = supertokens.UpdateSessionData(sessionHandle, map[string]interface{}{
    "key": "value",
})
```

## Revoking a session
```go
// revoke a single session
revoked, err := supertokens.RevokeSession(sessionHandle);
if (revoked) {
    // successfully revoked
} else {
    // session did not exist
}
```
```go
// revoke multiple sessions
sessionsRevoked, err := supertokens.RevokeMultipleSessions([]string{sessionHandle1, sessionHandle2});
```
```go
// revoke all sessions for a user
sessionsRevoked, err := supertokens.RevokeAllSessionsForUser(userId);
```