---
id: revoke-multiple-sessions
title: revoke_multiple_sessions
hide_title: true
---

# `revoke_multiple_sessions(session_handles)`
### Parameters
- `session_handles`
    - **type:** `List[str]`
    - **description**: An array of session handles to revoke

### Returns
- `Awaitable[List[str]]`
    - array of revoked session handles

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**