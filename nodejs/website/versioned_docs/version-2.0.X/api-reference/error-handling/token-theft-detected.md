---
id: version-2.0.X-token-theft-detected
title: TOKEN_THEFT_DETECTED
hide_title: true
original_id: token-theft-detected
---

# ```supertokens.Error.TOKEN_THEFT_DETECTED```

**Type:** `{errType: supertokens.Error.TOKEN_THEFT_DETECTED, err: { sessionHandle: string, userId: string }}`
- This is thrown when we detect token theft.
- Using the `err` object, you can revoke the affected user's current session, or all their sessions.
- This is an ```enum``` and the ```number``` value of this (as seen on the console) is ```4000``` 