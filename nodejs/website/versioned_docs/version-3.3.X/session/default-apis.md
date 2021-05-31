---
id: version-3.3.X-default-apis
title: Default APIs
hide_title: true
original_id: default-apis
---

# Default APIs

### [Refresh Session](https://github.com/supertokens/frontend-driver-interface/blob/master/v1.5.0.md#refresh-session)
Used to refresh a session by generating new access and refresh tokens. It takes ``sRefreshToken`` as a cookie and ``anti-csrf``(if enabled in core config) as a header value. The response object contains the session cookie and header values.
