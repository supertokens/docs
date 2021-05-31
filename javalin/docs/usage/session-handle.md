---
id: session-handle
title: Session Handle
hide_title: true
---

# Session Handle

Each session has a unique identifier which stays constant until the end of the session. This is not the access, nor the refresh token, it is merely a "handle" to the session, hence the name.

Please see the API reference to learn more about the functions used below.

## Obtaining a session's handle
```java
// get session handle of the current request
String handle = session.getSessionHandle()
```
```java
// get all sessions belonging to a user
String[] sessionHandles = SuperTokens.getAllSessionHandlesForUser(userId);
```

## Get and update JWT Payload
```java
Map<String, Object> jwtPayload = SuperTokens.getJWTPayload(sessionHandle);

SuperTokens.updateJWTPayload(sessionHandle, newJWTPayload);
```

## Get and update session data
```java
Map<String, Object> sessionData = SuperTokens.getSessionData(sessionHandle);
SuperTokens.updateSessionData(sessionHandle, newSessionData);
```

## Revoking a session
```java
// revoke a single session
boolean revoked = SuperTokens.revokeSession(sessionHandle);
if (revoked) {
    // successfully revoked
} else {
    // session did not exist
}
```
```java
// revoke multiple sessions
String[] sessionsRevoked = SuperTokens.revokeMultipleSessions(new String[]{sessionHandle1, sessionHandle2});
```
```java
// revoke all sessions for a user
String[] sessionsRevoked = SuperTokens.revokeAllSessionsForUser(userId);
```