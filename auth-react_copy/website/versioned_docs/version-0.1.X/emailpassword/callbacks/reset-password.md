---
id: version-0.1.X-reset-password
title: Reset password feature callbacks
original_id: reset-password
---

This page references the callbacks for the `SignInAndUp` feature component. 

Follow the [common customizations guide section](/docs/emailpassword/common-customizations/reset-password/embed-in-page) if you would like to use those components callbacks.


### onHandleSuccess

- #### Description

    `onHandleSuccess` is called when a user completes the Sign in / Sign out process successfully. It is useful if you would like to show a custom message to your user, or if you would like to keep logs of these events in your system.

- #### Input:

    ```
    context: { action: "RESET_PASSWORD_EMAIL_SENT" | "PASSWORD_RESET_SUCCESSFUL" }
    ```

- #### Output:

    ```
    Promise<boolean>
    ```
    - return `true` if you have handled the event successfully.
    - return `false` if you want to fall back to the default implementation.

- #### Example: 

    ```js
        <ResetPasswordUsingToken
            onHandleSuccess={async (context) => {
                //  on reset password success callback.
            }}
        />
    ```

- #### Optional:

    `true`
    


### onCallSubmitNewPasswordAPI

- #### Description:

    `onCallSubmitNewPasswordAPI` is called when a user clicks on "send reset password email" button if front end validations were successful.
    By default, SuperTokens will call the backend appropriately but if you would like to overwrite this method, use the `onCallSubmitNewPasswordAPI` props.

- #### Input:

    ```
    requestJson: {formFields: { id: string, value: string}[] }
    headers: { rid: string}
    ```

- #### Output:

    ```
    Promise<
        {status: "OK"} |
        {status: "RESET_PASSWORD_INVALID_TOKEN_ERROR"} |
        {status: "FIELD_ERROR", formFields: {id: string, error: string}[]}
    >
    ```

    - Anything else will be treated as a general error, displaying the "Something went wrong. Please try again" error.

- #### Example: 

    ```js
        <SignInAndUp
            onCallSubmitNewPasswordAPI={async (requestJson, headers) => {
                const result = await myCustomAPICall(requestJson, headers);
                // Custom implementation.

                // If successfully changed password
                return {
                    status: "OK"
                }
            }}
        />
    ```

- #### Optional:

    `true`

### onCallSendResetEmailAPI

- #### Description:

    `onCallSendResetEmailAPI` is called when a user clicks on "send reset password email" button if front end validations were successful.

    By default, SuperTokens will call the backend appropriately but if you would like to overwrite this method, use the `onCallSendResetEmailAPI` props.

- #### Input:

    ```
    requestJson: {formFields: { id: string, value: string}[] }
    headers: { rid: string}
    ```

- ###Output:

    ```
    Promise<
        {status: "OK"} |
        {status: "FIELD_ERROR", formFields: {id: string, error: string}[]}
    >
    ```
    - Anything else will be treated as a general error, displaying the "Something went wrong. Please try again" general error.

- #### Example: 

    ```js
        <SignInAndUp
            onCallSendResetEmailAPI={async (requestJson, headers) => {
                const result = await myCustomAPICall(requestJson, headers);
                // Custom implementation.

                // If successfully sent reset password email.
                return {
                    status: "OK"
                }
            }}
        />
    ```

- #### Optional:

    `true`
