---
id: version-1.0.X-revoke-multiple-sessions
title: revoke_multiple_sessions
hide_title: true
original_id: revoke-multiple-sessions
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