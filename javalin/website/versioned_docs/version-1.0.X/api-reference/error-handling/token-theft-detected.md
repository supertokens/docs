---
id: version-1.0.X-token-theft-detected
title: TokenTheftDetectedException
hide_title: true
original_id: token-theft-detected
---

# ```io.supertokens.javalin.core.exception.TokenTheftDetectedException```

- This is thrown when we detect token theft.
- Using this, you can revoke the affected user's current session, or all their sessions.
    - `exception.getUserId()`
    - `exception.getSessionHandle()`