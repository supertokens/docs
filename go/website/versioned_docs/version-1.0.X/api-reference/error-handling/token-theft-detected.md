---
id: version-1.0.X-token-theft-detected
title: TokenTheftDetectedError
hide_title: true
original_id: token-theft-detected
---

# ```TokenTheftDetectedError```

- This is thrown when we detect token theft.
- Using this, you can revoke the affected user's current session, or all their sessions.
    - `err.UserID`
    - `err.SessionHandle`