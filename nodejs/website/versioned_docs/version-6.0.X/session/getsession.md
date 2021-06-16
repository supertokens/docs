---
id: version-6.0.X-getsession
title: getSession
hide_title: true
original_id: getsession
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
- If the session does not exist and `sessionRequired` is not `false`
- If the access token has expired, we need to try the refresh token.