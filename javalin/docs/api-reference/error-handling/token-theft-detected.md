---
id: token-theft-detected
title: TokenTheftDetectedException
hide_title: true
---

# ```io.supertokens.javalin.core.exception.TokenTheftDetectedException```

- This is thrown when we detect token theft.
- Using this, you can revoke the affected user's current session, or all their sessions.
    - `exception.getUserId()`
    - `exception.getSessionHandle()`