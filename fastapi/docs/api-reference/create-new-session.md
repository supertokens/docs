---
id: create-new-session
title: create_new_session
hide_title: true
---

# `create_new_session(request, user_id, jwt_payload = {}, session_data = {})`
### Parameters
- `request`
    - **type:** `fastapi.Request`
- `user_id`
    - **type:** `str`
    - **description:** Should be used to ID a user in your system.
- `jwt_pay_load` (*Optional*)
    - **type:** `dict`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information.
- `session_data` (*Optional*)
    - **type:** `dict`
    - **description:** This information is stored only in your database, so it can contain sensitive information.

### Returns
- `Awaitable[Session]` on successful creation of a session. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[SuperTokensGeneralError](./error-handling/general-error)**

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These are set in the cookies and header of the `response` object sent from your API.