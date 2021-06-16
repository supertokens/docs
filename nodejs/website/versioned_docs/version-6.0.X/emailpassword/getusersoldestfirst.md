---
id: version-6.0.X-getusersoldestfirst
title: getUsersOldestFirst
hide_title: true
original_id: getusersoldestfirst
---

# ``getUsersOldestFirst(limit, nextPaginationToken)``

### Parameters
- ``limit`` (Optional)
  - type: ``number``
- ``nextPaginationToken`` (Optional)
  - type: ``string``


### Returns
- ``Promise<{users: User[]; nextPaginationToken?: string | undefined;}>`` Returns a list of [users](https://github.com/supertokens/core-driver-interface/wiki#user) sorted by oldest first.

### Additional Information:
- If the ``nextPaginationToken`` is ``undefined``, then there are no more users to loop through.
- If there are no users in your app, then ``nextPaginationToken`` will be ``undefined`` and users will be an empty array
