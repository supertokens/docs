---
id: create-new-session
title: CreateNewSession
hide_title: true
---

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
# `CreateNewSession(response http.ResponseWriter, userID string, payload ...map[string]interface{}) (Session, error)`

### Parameters
- `response`
    - **description:** Response writer object from your API handler
- `userId`
    - **description:** Should be used to ID a user in your system.
- `payload`
    - **description:** There are two types of payloads:
        - JWT Payloads: This must be at index 0 of the `payload` param. This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information. The `interface{}` in the map can be any of the primitive types, an `[]interface{}` or another `map[string]interface{}`. 
        - Session Data: This must be at index 1 of the `payload` param. This information is stored only in your database, so it can contain sensitive information. The `interface{}` in the map can be any of the primitive types, an `[]interface{}` or another `map[string]interface{}`.

<!--Gin-->

# `CreateNewSession(c *gin.Context, userID string, payload ...map[string]interface{}) (Session, error)`

### Parameters
- `c`
    - **description:** Context object from your API handler
- `userId`
    - **description:** Should be used to ID a user in your system.
- `payload`
    - **description:** There are two types of payloads:
        - JWT Payloads: This must be at index 0 of the `payload` param. This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information. The `interface{}` in the map can be any of the primitive types, an `[]interface{}` or another `map[string]interface{}`. 
        - Session Data: This must be at index 1 of the `payload` param. This information is stored only in your database, so it can contain sensitive information. The `interface{}` in the map can be any of the primitive types, an `[]interface{}` or another `map[string]interface{}`.

<!--END_DOCUSAURUS_CODE_TABS-->

### Returns
- `Session` on successful creation of a session. To know more about the `Session` object, click [here](./session-object/overview)
- [GeneralError](./error-handling/general-error) if something goes wrong

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These are set in the cookies and header of the `ctx` object.
