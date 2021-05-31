---
id: version-1.0.X-revoke-all-sessions-for-user
title: revoke_all_sessions_for_user
hide_title: true
original_id: revoke-all-sessions-for-user
---

# `revoke_all_sessions_for_user(user_id)`

### Parameters
- `user_id`
    - **type:** `str`

### Returns
- `Awaitable[List[str]]`
    - array of revoked session handles

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**