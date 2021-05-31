---
id: version-1.0.X-auth0-handler
title: auth0_handler
hide_title: true
original_id: auth0-handler
---

# `auth0_handler(request, domain, client_id, client_secret, callback?)`
### Parameters
- `request`
    - **type:** `fastapi.Request`
- `domain`
    - **type:** `string`
    - **description:** Auth0 domain for your application
- `client_id`
    - **type:** `string`
    - **description:** Auth0 client ID
- `client_secret`
    - **type:** `string`
    - **description:** Auth0 client secret
- `callback` (*Optional*)
    - **type:** `async function (user_id: string, auth0_id_token: string, auth0_access_token: string, auth0_refresh_token: string) => None`
    - **description:** async function that can be used to create a SuperTokens session manually.

### Returns
- `Promise<fastapi.Response>`

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**