---
id: version-4.2.X-default-apis
title: Default APIs
hide_title: true
original_id: default-apis
---

# Default APIs

### [Refresh Session](https://github.com/supertokens/frontend-driver-interface/blob/master/v1.5.0.md#refresh-session)
Used to refresh a session by generating new access and refresh tokens. It takes ``sRefreshToken`` as a cookie and ``anti-csrf``(if enabled in core config) as a header value. The response object contains the session cookie and header values.

### [Logout API](https://github.com/supertokens/frontend-driver-interface/blob/master/v1.7.0.md#url-apibasepathsignout)
Used to revoke a user session.