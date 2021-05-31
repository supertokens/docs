---
id: user-logout
title: Logout / Revoke Session
hide_title: true
---

# Logout / Revoke Session

### `revoke_session` function: [API Reference](../api-reference/session-object/revoke-session)
```python
# needs to be called inside an async function
await session.revoke_session()
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.

<div class="divider"></div>

### Example
```python
from supertokens_fastapi import supertokens_session, Session
from fastapi import Depends
from fastapi.responses import JSONResponse

@app.post('/logout')
async def logout(session: Session = Depends(supertokens_session)):
    await session.revoke_session()
    return JSONResponse({})
```