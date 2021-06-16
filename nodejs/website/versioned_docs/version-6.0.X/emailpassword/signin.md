---
id: version-6.0.X-signin
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
- If the email & password combination is incorrect.