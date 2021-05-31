---
id: version-3.3.X-signin
title: signIn
hide_title: true
original_id: signin
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