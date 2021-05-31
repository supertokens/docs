---
id: version-3.3.X-getsession
title: getSession
hide_title: true
original_id: getsession
---

# ``getSession(req, res, doAntiCsrfCheck)``
### Parameters
- ``req`` 
  - type: ``Express.Request``
- ``res`` 
  - type: ``Express.Response``
- ``doAntiCsrfCheck`` (Optional)
  - type: ``boolean``

### Returns
- ``Promise<Session>``

### Throws
- [UNAUTHORISED](./errorhandler/unauthorised)
- [TRY_REFRESH_TOKEN](./errorhandler/tryrefreshtoken)