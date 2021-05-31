---
id: auth0-integration
title: Auth0 Integration
hide_title: true
---

# Auth0 Integration

Using our library, you can easily use the authorisation code grant flow via the backend channel for Auth0.

Start by creating a route that uses the `supertokens.auth0_handler()` ([API Reference](../api-reference/auth0-handler)) function like the following:
```python
from supertokens_fastapi import auth0_handler

@app.post("/supertokens-auth0")
async def auth0_integration(request: Request):
    return await auth0_handler(request, 
    "<Auth0 Domain>", 
    "<Auth0 Client ID>",
    "<Auth0 secret key>")
```
The above function will receive the authorisation code from your frontend and use that to get an ID and a refresh token from Auth0. After that, it will create a new SuperTokens session based on the `sub` claim in the ID Token. 

The tokens issued by Auth0 are stored on your backend, whilst the SuperTokens session tokens are sent to the frontend via `HttpOnly` cookies.

If you would like to change `"/supertokens-auth0"` to a different path, you can do so, however, be sure to specify that on the frontend (see frontend SDK section).

**Please also see our [frontend SDK](/docs/auth0/installation)**