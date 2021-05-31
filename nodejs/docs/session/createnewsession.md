---
id: createnewsession
title: createNewSession
hide_title: true
---

# ``createNewSession(res, userId, jwtPayload, sessionData)``
### Parameters

- ``res`` 
  - type: ``Express.Response``
- ``userId``
  - type: ``string``
- ``jwtPayload``
  - type: ``object``
- ``sessonData``
  - type: ``object``


### Returns
- ``Promise<Session>``  on successful creation of a session.

### Throws
- [GENERAL_ERROR](./../errors/general_error)

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These are set in the cookies and header of the res object.