---
id: version-3.3.X-createresetpasswordtoken
title: createResetPasswordToken
hide_title: true
original_id: createresetpasswordtoken
---

# ``createResetPasswordToken(userId)``

### Parameters
- ``userId``
  - type: ``string``


### Returns
- ``Promise<string>`` on submitting a valid user ID.

### Throws
- [GENERAL_ERROR](./../errors/general_error)
- [UNKNOWN_USER_ID_ERROR](./errors/unknown_user_id_error)