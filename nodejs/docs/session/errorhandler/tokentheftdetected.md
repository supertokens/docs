---
id: tokentheftdetected
title: TOKEN_THEFT_DETECTED
hide_title: true
---

# ``TOKEN_THEFT_DETECTED``
Type: ``{errType: supertokens.Error.TOKEN_THEFT_DETECTED, payload: { userId: string; sessionHandle: string;, message: string}``

- This is thrown when we detect token theft.
- The ``message`` string inside contains the error message
- Using the ``payload``, you can revoke the affected user's current session, or all their sessions.
