---
id: version-3.3.X-revokesession
title: revokeSession
hide_title: true
original_id: revokesession
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