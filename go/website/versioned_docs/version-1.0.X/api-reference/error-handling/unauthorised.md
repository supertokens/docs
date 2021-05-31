---
id: version-1.0.X-unauthorised
title: UnauthorizedError
hide_title: true
original_id: unauthorised
---

# ```UnauthorizedError```

- This error is thrown when the library is sure that this user's session does not exist anymore. This can happen:
    - If the refresh token expires.
    - If the user clears the cookies.
    - If the session has been revoked or the user has logged out.