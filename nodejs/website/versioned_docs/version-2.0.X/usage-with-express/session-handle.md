---
id: version-2.0.X-session-handle
title: Session Handle
hide_title: true
original_id: session-handle
---

# Session Handle

Each session has a unique identifier which stays constant until the end of the session. This is not the access, nor the refresh token, it is merely a "handle" to the session, hence the name.

Please see the API reference to learn more about the functions used below.

## Obtaining a session's handle
```js
// get session handle of the current request
let handle = req.session.getHandle()
```
```js
// get all sessions belonging to a user
let sessionHandles = await supertokens.getAllSessionHandlesForUser(userId);
sessionHandles.forEach(handle => {
    // do something with each session
})
```

## Get and update JWT Payload
```js
let jwtPayload = await supertokens.getJWTPayload(sessionHandle);

await supertokens.updateJWTPayload(sessionHandle, newJWTPayload);
```

## Get and update session data
```js
let sessionData = await supertokens.getSessionData(sessionHandle);

await supertokens.updateSessionData(sessionHandle, newSessionData);
```

## Revoking a session
```js
// revoke a single session
let revoked = await supertokens.revokeSession(sessionHandle);
if (revoked) {
    // successfully revoked
} else {
    // session did not exist
}
```
```js
// revoke multiple sessions
let sessionsRevoked = await supertokens.revokeMultipleSessions([sessionHandle1, sessionHandle2]);
sessionsRevoked.forEach(revokedHandle => {
    // do something with each revoked sessions
})
```
```js
// revoke all sessions for a user
let sessionsRevoked = await supertokens.revokeAllSessionsForUser(userId);
sessionsRevoked.forEach(revokedHandle => {
    // do something with each revoked sessions
})
```