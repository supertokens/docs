---
id: token-theft-detected
title: TokenTheftDetectedError
hide_title: true
---

# ```TokenTheftDetectedError```

- This is thrown when we detect token theft.
- Using this, you can revoke the affected user's current session, or all their sessions.
    - `err.UserID`
    - `err.SessionHandle`