---
id: version-1.0.X-revoke-multiple-sessions
title: RevokeMultipleSessions
hide_title: true
original_id: revoke-multiple-sessions
---

# `RevokeMultipleSessions(sessionHandles []string) ([]string, error)`
### Parameters
- `sessionHandles`
    - **description**: An array of session handles to revoke

### Returns
- `[]string`
    - array of revoked session handles
- [GeneralError](./error-handling/general-error)