---
id: version-4.1.X-revokesesion
title: revokeSession
hide_title: true
original_id: revokesesion
---

# ``revokeSession(sessionHandle)``
### Parameters
- ``userId`` 
  - type: ``String``

### Returns
- ``Promise<boolean>`` 
  - ``true`` if session was deleted from the database
  - ``false`` in case there was nothing to delete.

### Throws
- [GENERAL_ERROR](./../errors/general_error)