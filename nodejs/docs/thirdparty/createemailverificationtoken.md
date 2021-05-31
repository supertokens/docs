---
id: createemailverificationtoken
title: createEmailVerificationToken
hide_title: true
---

# `createEmailVerificationToken(userId)`

### Parameters
- `userId`
  - type: `string`


### Returns
- `Promise<string>`, on submitting a valid user ID.

### Throws 
- [EMAIL_ALREADY_VERIFIED_ERROR](./../emailpassword/errors/email_already_verified_error)
- [GENERAL_ERROR](./../errors/general_error)