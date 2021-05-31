---
id: version-1.0.X-session-handle
title: Session Handle
hide_title: true
original_id: session-handle
---

# Session Handle
A `sessionHandle` is a unique ID for a session in your system. It stays the same during the entire lifetime a session - even though the actual access and refresh tokens keep changing.

### How do you get a sessionHandle?
- If you are **NOT using express**, the [`getSession`](./get-session) function returns an object that contains this value.
- You can call the [`getAllSessionHandlesForUser`](./get-all-session-handles-for-user) function
- If token theft is detected, then the `err` object will contain a sessionHandle. `{errType: supertokens.Error.TOKEN_THEFT_DETECTED, err: { sessionHandle: string, userId: string }}`

### What can you do with a sessionHandle?
- Revoke a session ([link](./revoke-session-using-session-handle)).
- Update session data ([link](./update-session-data))
- Get session data ([link](./get-session-data))
