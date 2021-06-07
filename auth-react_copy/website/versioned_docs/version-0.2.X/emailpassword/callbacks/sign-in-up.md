---
id: version-0.2.X-sign-in-up
title: Sign-up / Sign-in feature callbacks
original_id: sign-in-up
---

This page references the callbacks for the `SignInAndUp` feature component.

Follow the [common customizations guide section](/docs/emailpassword/common-customizations/signup-form/embed-in-page) if you would like to use those components callbacks.

### onCallSignUpAPI

- #### Description:

    `onCallSignUpAPI` is called when a user clicks on the Sign up button if front end validations were successful.
By default, SuperTokens will call the backend appropriately but if you would like to overwrite this method, use the `onCallSignUpAPI` props.

- #### Input:

    ```
    requestJson: {formFields: { id: string, value: string}[] }
    headers: { rid: string}
    ```

- #### Output:

    ```
    Promise<
        {status: "OK" | user: {id: string, email: string} } |
        {status: "FIELD_ERROR", formFields: {id: string, error: string}[]}
    >
    ```
    - Anything else will be treated as a general error, displaying the "Something went wrong. Please try again" general error.

- #### Example:

    ```js
        <SignInAndUp
            onCallSignUpAPI={async (requestJson, headers) => {
                const result = await myCustomAPICall(requestJson, headers);
                // Custom implementation.

                // If successful sign up: 
                return {
                    status: "OK",
                    user: {
                        id: result.user.id,
                        email: result.user.email
                    }
                    // anything else you would like to receive in onHandleSuccess callback (details below)
                }
            }}
        />
    ```

- #### Optional:

    `true`


### onCallSignInAPI
- #### Description:

    `onCallSignInAPI` is called when a user clicks on Sign in button if front end validations were successful.
By default, SuperTokens will call the backend appropriately but if you would like to overwrite this method, use the `onCallSignInAPI` props.

- #### Input:

    ```
    requestJson: {formFields: { id: "email" | "password", value: string}[] }
    headers: { rid: string}
    ```

- #### Output:

    ```
    Promise<
        {status: "OK" | user: {id: string, email: string} } |
        {status: "FIELD_ERROR", formFields: {id: string, error: string}[]} |
        {status: "WRONG_CREDENTIALS_ERROR"}
    >
    ```
    - Anything else will be treated as a general error, displaying the "Something went wrong. Please try again" error.

- #### Example:

    ```js
        <SignInAndUp
            onCallSignUpAPI={async (requestJson, headers) => {
                const result = await myCustomAPICall(requestJson, headers);
                // Custom implementation.

                // If successful sign up: 
                return {
                    status: "OK",
                    user: {
                        id: result.user.id,
                        email: result.user.email
                    },
                    // anything else you would like to receive in onHandleSuccess callback (details below)
                }
            }}
        />
    ```

- #### Optional:

    `true`


### onHandleSuccess
- #### Description:

    `onHandleSuccess` is called when a user completes the Sign in / Sign out process successfully. It is useful if you would like to show a custom notification to your user, redirect to a particular place in your app based on user data or if you would like to keep logs of these events in your system.

- #### Input:

    ```
    context: {
        action: "SESSION_ALREADY_EXISTS"
        } | 
        {
            action: "SIGN_IN_COMPLETE" | "SIGN_UP_COMPLETE",
            user: {id: string, email: string},
            responseJson: {} // response body from the API.
        }
    ```

- #### Output:

    ```
    Promise<boolean>
    ```
    - return `true` if you have handled the event successfully.
    - return `false` if you want to fall back to the default implementation.

- #### Example:

    ```js
        <SignInAndUp
            onHandleSuccess={async (context) => {
                if (context.action === "SESSION_ALREADY_EXISTS") {
                    console.log("Already logged in");
                }
                if (context.action === "SIGN_IN_COMPLETE") {
                    // On successful Sign in...
                    console.log("Sign in", context.user);
                }
                if (context.action === "SIGN_UP_COMPLETE") {
                    // On successful Sign up...
                    console.log("Sign up", context.user);
                }
            }}
        />
    ```

- #### Optional:

    `true`
    
### doesSessionExist

- #### Description:

    By default, if you use the SuperTokens session management, when a user tries to access the Sign-up / Sign-in page while being signed in, they will be redirected to your application page (`onSuccessRedirectURL` config defined [here](../init)). If you use different session management for your website, you can overwrite this default behaviour.

- #### Example:

    ```js
        <SignInAndUp
            doesSessionExist={async () => {
                // Custom way to verify if a session exists.

            }}
        />
    ```

- #### Optional:

    `true`



### onHandleForgotPasswordClicked
- #### Description:

    When a user clicks on the reset password link in the Sign-in form, by default it simply redirects to the SuperTokens reset password page. If you want to handle that event yourself, you should pass the `onHandleForgotPasswordClick` props to the `SignInAndUp` feature.

- #### Output:

    ```
    Promise<boolean>
    ````
    - return `true` if you have handled the forgot password clicked successfully
    - return `false` if you want to fall back to the default implementation.


- #### Example:

    ```js
        <SignInAndUp
            onHandleForgotPasswordClicked={async () => {
                // Custom way to handle forgot password clicked.
            }}
        />
    ```

- #### Optional:

    `true`

### onCallEmailExistsAPI

- #### Description:

    `onCallEmailExistsAPI` is called on email input blur for signup only. It helps to give the end user immediate feedbacks if their email is already registered. If you want to handle that event yourself, you should pass the `onCallEmailExistsAPI` props to the `SignInAndUp` feature.

- #### Input:

    ```
    value: string
    headers: { rid: string}
    ```

- #### Output:

    ```
    Promise<
        {status: "OK" | exists: boolean }
    >
    ```
    - Anything else will be treated as an error and will fail silently, not showing any error message to the end user.


- #### Example:

    ```js
        <SignInAndUp
            verifyEmailExists={async (value, headers) => {
                // Custom way to verify that an email exists
            }}
        />
    ```

- #### Optional:

    `true`
