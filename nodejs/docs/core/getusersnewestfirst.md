---
id: getusersnewestfirst
title: getUsersNewestFirst
hide_title: true
---

> This function is applicable only for core versions >= 3.5

# ``getUsersNewestFirst({limit?, paginationToken?, includeRecipeIds?})``

### Parameters
- ``limit`` (Optional)
  - type: ``number``
- ``paginationToken`` (Optional)
  - type: ``string``
- ``includeRecipeIds`` (Optional)
  - type: ``string[]``


### Returns
- ``Promise<{users: User[]; nextPaginationToken?: string | undefined;}>``

### Additional Information:
- If the ``nextPaginationToken`` is ``undefined``, then there are no more users to loop through.
- If there are no users in your app, then ``nextPaginationToken`` will be ``undefined`` and users will be an empty array
