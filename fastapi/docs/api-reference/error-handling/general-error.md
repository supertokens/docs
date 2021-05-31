---
id: general-error
title: SuperTokensGeneralError
hide_title: true
---

# ```SuperTokensGeneralError```

- This is the most general type of error. Can be thrown for a variety of reasons:
    - Connection issues to SuperTokens instance
    - Generic "Something went wrong" errors.
- The way to handle this error is to simply send a status code of `500`