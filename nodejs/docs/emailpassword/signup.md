---
id: signup
title: signUp
hide_title: true
---

# ``signUp(email, password)``

### Parameters
- ``email``
  - type: ``string``
- ``password``
  - type: ``string``

### Returns
- ``Promise<User>`` on successfull sign up. To know about the ``User`` object click [here](https://github.com/supertokens/core-driver-interface/wiki#user)

### Throws
- [GENERAL_ERROR](./../errors/general_error)
- [EMAIL_ALREADY_EXISTS_ERROR](./errors/email_already_exists_error)

