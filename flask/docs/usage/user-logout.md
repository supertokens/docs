---
id: user-logout
title: Logout / Revoke Session
hide_title: true
---

# Logout / Revoke Session

### `revoke_session` function: [API Reference](../api-reference/session-object/revoke-session)
```python
session.revoke_session()
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.

<div class="divider"></div>

### Example
```python
from supertokens_flask import supertokens_middleware
from flask import g

@app.route('/logout', methods=['POST'])
@supertokens_middleware
def logout():
    g.supertokens.revoke_session()
    return 'success'
```