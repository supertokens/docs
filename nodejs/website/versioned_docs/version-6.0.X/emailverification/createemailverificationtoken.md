---
id: version-6.0.X-createemailverificationtoken
title: createEmailVerificationToken
hide_title: true
original_id: createemailverificationtoken
---

# ``createEmailVerificationToken(userId)``

### Parameters
- ``userId``
  - type: ``string``


### Returns
- ``Promise<string>`` on submitting a valid user ID.

### Throws
- In case the email is already verified.
- If the user ID is unknown