---
id: version-3.3.X-reset_password_invalid_token_error
title: RESET_PASSWORD_INVALID_TOKEN_ERROR
hide_title: true
original_id: reset_password_invalid_token_error
---

# ``RESET_PASSWORD_INVALID_TOKEN_ERROR``
**Type** : ``{type: SessionError.RESET_PASSWORD_INVALID_TOKEN_ERROR, message: string}``
- The ``message`` string inside contains the error message
- The ``RESET_PASSWORD_INVALID_TOKEN_ERROR`` is thrown when trying to reset the password with an expired or invalid token.