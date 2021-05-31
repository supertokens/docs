---
id: session-dependency
title: Session Dependency
hide_title: true
---

# `Session Dependency`
- For the routes for which you want to access the associated [`Session`](./session-object/overview) object, you can simply use `Depends`
- The library provides three functions which you can use to fetch an active session in your route.
    - `supertokens_session`: if `enable_anti_csrf` (in the SuperTokens `config.yaml`) is set to `True`, `anit-csrf` token will required if the route method is not equal to `GET`.
    - `supertokens_session_with_anti_csrf`: if `enable_anti_csrf` (in the SuperTokens `config.yaml`) is set to `True`, `anit-csrf` token will required for the route regardless of the request method.
    - `supertokens_session_without_anti_csrf`: `anit-csrf` token will not be check for the route.

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**
- **[SuperTokensUnauthorisedError](./error-handling/unauthorised)**
    - This is thrown if a session does not exist, or has been revoked (if blacklisting is switched on).
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- **[SuperTokensTryRefreshTokenError](./error-handling/try-refresh-token)**
    - This will be thrown if JWT verification fails. This happens, for example, if the token has expired or the JWT signing key has changed.
    - This will be thrown if CSRF protection is on and anti-csrf token is missing or invalid.
    - When this is thrown, none of the auth cookies are removed - you should return a session expired status code which will instruct your frontend to call the refresh token API endpoint.

### Example
```python
from supertokens_fastapi import (
    Session, supertokens_session
)
from fastapi import Depends
...

@app.get("/user/info")
async def external_api(session: Session = Depends(supertokens_session)):
    # use session object in your logic

...
```