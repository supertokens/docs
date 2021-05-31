---
id: createemailverificationtoken
title: createEmailVerificationToken
hide_title: true
---

# ``createEmailVerificationToken(userId)``

### Parameters
- ``userId``
  - type: ``string``


### Returns
- ``Promise<string>`` on submitting a valid user ID.

### Throws
- [EMAIL_ALREADY_VERIFIED_ERROR](./errors/email_already_verified_error)
- [UNKNOWN_USER_ID_ERROR](./errors/unknown_user_id_error)