---
id: version-2.3.X-auth0-handler
title: auth0Handler
hide_title: true
original_id: auth0-handler
---

# `auth0Handler(request, response, next, domain, clientId, clientSecret, callback?)`
### Parameters
- `request`
    - **type:** `Express.Request`
- `response`
    - **type:** `Express.Response`
- `next`
    - **type:** `Express.NextFunction`
- `domain`
    - **type:** `string`
    - **description:** Auth0 domain for your application
- `clientId`
    - **type:** `string`
    - **description:** Auth0 client ID
- `clientSecret`
    - **type:** `string`
    - **description:** Auth0 client secret
- `callback` (*Optional*)
    - **type:** `function (userId: string, auth0IdToken: string, auth0AccessToken: string, auth0RefreshToken: string | undefined) => void`
    - **description:** Function that can be used to create a SuperTokens session manually.

### Returns
- `Promise<Express.Response>`

### Throws
- **[GENERAL_ERROR](./error-handling/general-error)**