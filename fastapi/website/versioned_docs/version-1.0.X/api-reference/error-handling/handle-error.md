---
id: version-1.0.X-handle-error
title: Handle errors
hide_title: true
original_id: handle-error
---

# Handle errors
### `set_unauthorised_error_handler(callback)`
- **Parameter**: 
    - `callback`
        - **type:** `Callable[[SuperTokensUnauthorisedError], Union[Awaitable[Response], Response]]`
        - **description:** The callback should accept 1 argument which will of class `SuperTokensUnauthorisedError`. The callback can be synchronous or asynchronous.
- **Default behaviour**: Sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `401`
- All auth cookies are cleared by the time this function is called, even if you do not use the default one.

### `set_try_refresh_token_error_handler(callback)`
- **Parameter**: 
    - `callback`
        - **type:** `Callable[[SuperTokensTryRefreshTokenError], Union[Awaitable[Response], Response]]`
        - **description:** The callback should accept 1 argument which will of class `SuperTokensTryRefreshTokenError`. The callback can be synchronous or asynchronous.
- **Default behaviour**: Sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `401`
- No auth cookies are cleared.

### `set_token_theft_detected_error_handler(callback)`
- **Parameter**:
    - `callback`:
        - **type:** `Callable[[str, str], Union[Awaitable[Response], Response]]`
        - **description:** The callback will take two string parameters. First will be the `session_handle` for which token tehft is detected. Second string parameter corresponds to the `user_id` of the user who the `session_handle` belongs to. The callback can be synchronous or asynchronous.
- **Default behaviour**: Revokes the affected session and sends session expired status code as per what is set in the `config.yaml` file. By default, the status code is `401`.
- All auth cookies are cleared by the time this function is called, even if you do not use the default one.