---
id: handle-error
title: Handle errors
hide_title: true
---

# Handle errors
### `set_unauthorised_error_handler(err)`
- **Parameter**: 
    - `err`
        - **type:** [`SuperTokensUnauthorisedError`](./unauthorised)
- **Default behaviour**: Sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `401`
- All auth cookies are cleared by the time this function is called, even if you do not use the default one.

### `set_try_refresh_token_error_handler(error)`
- **Parameter**: 
    - `error`
        - **type:** [`SuperTokensTryRefreshTokenError`](./try-refresh-token)
- **Default behaviour**: Sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `401`
- No auth cookies are cleared.

### `set_token_theft_detected_error_handler(session_handle, user_id)`
- **Parameter**:
    - `session_handle`:
        - **type:** `string`
    - `user_id`
        - **type:** `string`
- **Default behaviour**: Revokes the affected session and sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `401`.
- All auth cookies are cleared by the time this function is called, even if you do not use the default one.