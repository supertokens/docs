---
id: signin
title: signIn
hide_title: true
---

# ``signIn(email, password)``

### Parameters
- ``email``
  - type: ``string``
- ``password``
  - type: ``string``

### Returns
- ``Promise<User>`` on successfull sign in. To know about the ``User`` object click [here](https://github.com/supertokens/core-driver-interface/wiki#userr)

### Throws
- [GENERAL_ERROR](./../errors/general_error)
- [WRONG_CREDENTIALS_ERROR](./errors/wrong_credentials_error)