---
id: getuserbyemail
title: getUserByEmail
hide_title: true
---

# ``getUserByEmail(email)``

### Parameters
- ``email``
  - type: ``string``


### Returns
- ``Promise<User>`` on submitting a valid user email. To know about the ``User`` object click [here](https://github.com/supertokens/core-driver-interface/wiki#user)
- `Promise<undefined>` in case the email doesn't exist