---
id: getsession
title: getSession
hide_title: true
---

# ``getSession(req, res, options)``
### Parameters
- ``req`` 
  - type: ``Express.Request``
- ``res`` 
  - type: ``Express.Response``
- ``options`` (Optional)
  - type: ``{antiCsrfCheck?: boolean, sessionRequired?: boolean}``

### Returns
- ``Promise<Session>``

### Throws
- [UNAUTHORISED](./errorhandler/unauthorised)
- [TRY_REFRESH_TOKEN](./errorhandler/tryrefreshtoken)