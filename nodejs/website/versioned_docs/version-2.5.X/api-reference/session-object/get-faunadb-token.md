---
id: version-2.5.X-get-faunadb-token
title: getFaunadbToken
hide_title: true
original_id: get-faunadb-token
---

# `getFaunadbToken()`

### Parameters
- none

### Returns
- `Promise<string>`

### Throws
- **[GENERAL_ERROR](../error-handling/general-error)**
- **[UNAUTHORISED](../error-handling/unauthorised)**
    - This is thrown if the current session was revoked or has expired.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.