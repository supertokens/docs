---
id: create-new-session
title: createNewSession
hide_title: true
---
# `createNewSession($response, $userId, $jwtPayload = [], $sessionData = [])`
### Parameters
- `$response`
    - **type:** `\Illuminate\Http\Response`
- `$userId`
    - **type:** `string`
    - **description:** Should be used to ID a user in your system.
- `$jwtPayload` (*Optional*)
    - **type:** `array`
    - **description:** This information is stored in the JWT sent to the frontend, so it should not contain any sensitive information.
- `$sessionData` (*Optional*)
    - **type:** `array`
    - **description:** This information is stored only in your database, so it can contain sensitive information.

### Returns
- `\SuperTokens\Session` on successful creation of a session. To know more about the `Session` object, click [here](./session-object/overview)

### Throws
- **[SuperTokensGeneralException](./error-handling/general-error)**

### Additional information
- Creates a new access, a new refresh and a new idRefresh token for this session. These are set in the cookies and header of the `$response` object.