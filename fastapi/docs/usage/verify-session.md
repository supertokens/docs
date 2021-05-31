---
id: verify-session
title: Verify Session
hide_title: true
---

# Verify Session

### Use [`supertokens_session`](../api-reference/session-dependency) dependency
```python
from supertokens_fastapi import supertokens_session, Session
from fastapi import Depends

...
async def function_name(session: Session = Depends(supertokens_session)):
    # use session to run you logic
    ...
```
- All APIs that require a valid session must use this session dependency.
- This uses the [`get_session`](../api-reference/get-session) function.

<div class="divider"></div>

### Example
```python
from supertokens_fastapi import supertokens_session, Session
from fastapi import Depends
from fastapi.responses import JSONResponse

@app.get('/info')
def info(session: Session = Depends(supertokens_session)):
    return JSONResponse({'userId': session.get_user_id()})
```