---
id: version-3.3.X-general_error
title: GENERAL_ERROR
hide_title: true
original_id: general_error
---

# ``GENERAL_ERROR``
Type: ``{type: SuperTokensError.GENERAL_ERROR, rid: string, payload: any}``
- The payload object inside the thrown error will be the actual error generated by whatever cause this error.
- This is the most general type of error. Can be thrown for a variety of reasons:
  - Connection issues to SuperTokens instance
  - Something went wrong while setting headers
  - Generic "Something went wrong" errors.