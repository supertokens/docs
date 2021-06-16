---
id: version-6.0.X-getuserbyid
title: getUserById
hide_title: true
original_id: getuserbyid
---

# ``getUserById(userId)``

### Parameters
- ``userId``
  - type: ``string``


### Returns
- ``Promise<User>`` on submitting a valid user ID. To know about the ``User`` object click [here](https://github.com/supertokens/core-driver-interface/wiki#user)
- `Promise<undefined>` in case the userId doesn't exist