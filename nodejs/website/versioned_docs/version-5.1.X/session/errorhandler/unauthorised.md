---
id: version-5.1.X-unauthorised
title: UAUTHORISED
hide_title: true
original_id: unauthorised
---

# ``UNAUTHORISED``
**Type** : ``{type: SessionError.UNAUTHORISED, message: string}``
- The ``message`` string inside contains the error message
- This error is thrown when the library is sure that this user's session does not exist anymore. This can happen:
  - If the refresh token expires.
  - If the user clears the cookies.
  - If the session has been revoked or the user has logged out.