---
id: version-4.2.X-init
title: init
hide_title: true
original_id: init
---

# ``init(config)``
You can customize the Session module by overwriting the following configs:

```js
Session.init({
    cookieSecure?: boolean,
    cookieSameSite?: "strict" | "lax" | "none",
    sessionExpiredStatusCode?: number,
    cookieDomain?: string,
    sessionRefreshFeature?: {
        disableDefaultImplementation?: boolean,
    },
    signOutFeature?: {
        disableDefaultImplementation?: boolean
    },
    errorHandlers?: ErrorHandlers,
    enableAntiCsrf?: boolean
})
```

### Parameters
- ``config``
  - ``cookieSecure`` (Optional)
    - type: ``boolean``
    - description: Sets if the cookies are secure or not.
  - ``cookieSameSite`` (Optional)
    - type:  ``"strict" | "lax" | "none"``
    - description: Sets the sameSite attribute for cookies issued by SuperTokens
  - ``sessionExpiredStatusCode`` (Optional)
    - type: ``number``
    - description: The HTTP status code your backend APIs send on session expiry
  - ``cookieDomain`` (Optional)
    - type: ``string``
    - description:  The domain from which the cookies will be created
  - ``sessionRefreshFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disables the default refresh API
  - ``signOutFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disable the default logout API
  - ``errorHandlers`` (Optional)
    - type: ``ErrorHandlers``
    - description: You can override the default SuperTokens error handler and define your own custom error handler.
  - ``enableAntiCsrf`` (Optional)
    - type: ``boolean``
    - description: Set this to `true` if you want to force enable anti csrf tokens.
