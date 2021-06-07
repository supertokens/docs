---
id: version-0.4.X-callbacks
title: Callbacks
original_id: callbacks
---

This page references the callbacks that you can set up in EmailPassword configs.
### preAPIHooks

- #### Description:

    `preAPIHooks` This async method can be used to update the request object sent to your API regarding authentication. 

- #### Input:

    ```
    context: { action: "SEND_RESET_PASSWORD_EMAIL" | "EMAIL_EXISTS" | "SUBMIT_NEW_PASSWORD" | "VERIFY_EMAIL" | "SEND_VERIFY_EMAIL" | "IS_EMAIL_VERIFIED" | "SIGN_IN" | "SIGN_UP" | "SIGN_OUT" }
    requestInit: RequestInit
    ```

- #### Output:

    ```
    Promise<RequestInit>
    ```
    - Modify the `requestInit` at your will before returning it as a response.

- #### Example:

    ```js
    SuperTokens.init({
        appInfo: {...},
        recipeList: [
            EmailPassword.init({
                preAPIHook(context) {
                    switch(context.action) {
                        case "SIGN_UP":
                            context.requestInit.headers["new-user"] = true;
                            break;
                        case "SIGN_IN":
                            // do things...
                            break;
                        (...)
                        default:
                            break;
                    }
                    return context.requestInit;
                }
            }
        ]
    });
    ```

- #### Optional:

    `true`

## getRedirectionURL

- #### Description:

    `getRedirectionURL` This async method can be used to update the redirection rules for specific paths.

- #### Input:

    ```
    context: { action: "SUCCESS" | "SIGN_IN_AND_UP" | "VERIFY_EMAIL" | "RESET_PASSWORD" }
    ```

- #### Output:

    ```
    Promise<string | undefined>
    ```
    - Return a URL (absolute or relative) to redirect to it or return undefined for default behaviour.

- #### Example:

    ```js
    SuperTokens.init({
        appInfo: {...},
        recipeList: [
            EmailPassword.init({
                getRedirectionURL(context) {
                    switch(context.action) {
                        case "RESET_PASSWORD":
                            return "/custom-reset-password";
                            break;
                        case "SIGN_IN_AND_UP":
                            return "/custom-sign-in-and-up";
                            break;
                        (...)
                        default:
                            break;
                    }
                    return undefined;
                }
            }
        ]
    });
    ```

- #### Optional:

    `true`


## onHandleEvent

- #### Description:

    `onHandleEvent` This method can be used to store analytics to your system on key events happening during authentication.

- #### Input:

    ```
    {
          action: "EMAIL_VERIFIED_SUCCESSFUL" | "VERIFY_EMAIL_SENT" | "EMAIL_VERIFIED_SUCCESSFUL" | "PASSWORD_RESET_SUCCESSFUL" | "RESET_PASSWORD_EMAIL_SENT" | "EMAIL_VERIFIED_SUCCESSFUL" | "SESSION_ALREADY_EXISTS";
    } | {
          
          action: "SIGN_IN_COMPLETE" | "SIGN_UP_COMPLETE";
          user: { id: string; email: string };
          responseJson: any;
    }
    ```

- #### Example:

    ```js
    SuperTokens.init({
        appInfo: {...},
        recipeList: [
            EmailPassword.init({
                onHandleEvent(context) {
                    switch(context.action) {
                        case "SIGN_UP_COMPLETE":
                            let {email, id} = context.user;
                            // Analytics events.
                            break;
                        case "SIGN_IN_COMPLETE":
                            // Do things.
                            break;
                        (...)
                        default:
                            break;
                    }
                }
            }
        ]
    });
    ```

- #### Optional:

    `true`



