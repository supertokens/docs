---
id: init
title: init
hide_title: true
---

# ``init(config)``
You can customize the Session module by overwriting the following configs:

```js
Session.init({
    cookieSecure?: boolean,
    cookieSameSite?: "strict" | "lax" | "none",
    sessionExpiredStatusCode?: number,
    cookieDomain?: string,
    errorHandlers?: ErrorHandlers,
    antiCsrf?: "NONE" | "VIA_CUSTOM_HEADER" | "VIA_TOKEN",
    override?: {
      functions?: function,
      apis?: function
    }
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
  - ``errorHandlers`` (Optional)
    - type: ``ErrorHandlers``
    - description: You can override the default SuperTokens error handler and define your own custom error handler.
  - ``antiCsrf`` (Optional)
    - type: `"NONE" | "VIA_CUSTOM_HEADER" | "VIA_TOKEN"`
    - description: See [this page](/docs/session/common-customizations/sessions/anti-csrf)
  - `override` (Optional)
    - type: `object of function`
    - description: Use this feature to override how this recipe behaves