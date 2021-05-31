---
id: refresh-session
title: RefreshSession
hide_title: true
---

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
# `RefreshSession(response http.ResponseWriter, request *http.Request) (Session, error)`
### Parameters
- `response`
    - **description:** Response writer object from your API handler
- `request`
    - **description:** Request writer object from your API handler
<!--Gin-->
# `RefreshSession(c *gin.Context) (Session, error)`
### Parameters
- `c`
    - **description:** Context object from your API handler
<!--END_DOCUSAURUS_CODE_TABS-->

### Returns
- `Session` on successful refresh. To know more about the `Session` object, click [here](./session-object/overview)
- [GeneralError](./error-handling/general-error)
- [UnauthorizedError](./error-handling/unauthorised)
    - This is thrown if the current session was revoked or has expired, or if the provided refresh token is invalid.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- [TokenTheftDetectedError](./error-handling/token-theft-detected)
    - This is thrown if token theft is detected.
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.