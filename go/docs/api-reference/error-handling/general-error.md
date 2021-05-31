---
id: general-error
title: GeneralError
hide_title: true
---

# ```GeneralError```
- This is the most general type of error. Can be thrown for a variety of reasons:
    - Connection issues to SuperTokens instance
    - Something went wrong while setting headers
    - Generic "Something went wrong" errors.
- The way to handle this error is to simply send a status code of `500`