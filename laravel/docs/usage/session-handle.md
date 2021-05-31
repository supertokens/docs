---
id: session-handle
title: Session Handle
hide_title: true
---

# Session Handle

Each session has a unique identifier which stays constant until the end of the session. This is not the access, nor the refresh token, it is merely a "handle" to the session, hence the name.

Please see the API reference to learn more about the functions used below.

## Obtaining a session's handle
```php
// get session handle of the current request
$session = $request->supertokens;
$handle = $session->getHandle();
```
```php
// get all sessions belonging to a user
$sessionHandles = SuperTokens::getAllSessionHandlesForUser($userId);
foreach ($sessionHandles as $handle){ 
  // do something..
} 
```

## Get and update JWT Payload
```php
$jwtPayload = SuperTokens::getJWTPayload($sessionHandle);

SuperTokens::updateJWTPayload($sessionHandle, $newJWTPayload);
```

## Get and update session data
```php
$sessionData = SuperTokens::getSessionData($sessionHandle);

SuperTokens::updateSessionData($sessionHandle, $newSessionData);
```

## Revoking a session
```php
// revoke a single session
$revoked = SuperTokens::revokeSession($sessionHandle);
if ($revoked) {
    // successfully revoked
} else {
    // session did not exist
}
```
```php
// revoke multiple sessions
$sessionsRevoked = SuperTokens::revokeMultipleSessions(array($sessionHandle1, $sessionHandle2));
foreach ($sessionsRevoked as $handle){ 
  // do something with each revoked sessions
} 
```
```php
// revoke all sessions for a user
$sessionsRevoked = SuperTokens::revokeAllSessionsForUser($userId);
foreach ($sessionsRevoked as $handle){ 
  // do something with each revoked sessions
} 
```