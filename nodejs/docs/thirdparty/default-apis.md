---
id: default-apis
title: Default APIs
hide_title: true
---

# Default APIs

#### [SignInUp API](https://github.com/supertokens/frontend-driver-interface/blob/master/v1.6.0.md#signinup-api)
It takes a `redirectURI`, `thirdPartyId` and `code` as input. User information is retrived from the backend. If a user does not exist a new user is created. On successful signup/signin a new user session is created and [`user`](https://github.com/supertokens/frontend-driver-interface/wiki#user) data is returned


####  [Signout API](https://github.com/supertokens/frontend-driver-interface/blob/master/v1.6.0.md#logout-api-1)
Used to revoke a user session.

####  [AuthorisationUrl API](https://github.com/supertokens/frontend-driver-interface/blob/master/v1.6.0.md#get-oauth-authorisation-url)
It retrives the authorization redirect url for the relevant thirdparty provider.