---
id: tryrefreshtoken
title: TRY_REFRESH_TOKEN
hide_title: true
---

# ``TRY_REFRESH_TOKEN``
**Type** : ``{type: SessionError.TRY_REFRESH_TOKEN, message: string}``
- The ``message`` string inside contains the error message
- The ``TRY_REFRESH_TOKEN`` is thrown when trying to verify an email which is already verified.
- This error is thrown when:
  - Access token validation failed.
  - CSRF token validation failed. (If enable_anti_csrf in the config object is set to true)