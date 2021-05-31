---
id: version-1.0.X-create-new-session
title: create_new_session
hide_title: true
original_id: create-new-session
---

# `create_new_session(res, userId, jwtPayload = {}, sessionData = {})`
### Parameters
- `res`
    - **type:** `flask.Response`
- `user_id`
    - **type:** `string`
    - **description:** Should be used to ID a user in your system.
- `jwt_pay_load` (*Optional*)
    - **type:** `dict`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information.
- `session_data` (*Optional*)
    - **type:** `dict`
    - **description:** This information is stored only in your database, so it can contain sensitive information.

### Returns
- `Session` on successful creation of a session. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These are set in the cookies and header of the `res` object.