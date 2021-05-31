---
id: callbacks
title: Callbacks
---

This page references the callbacks that you can set up in EmailPassword configs.
### preAPIHooks

- #### Description:

    `preAPIHooks` This async method can be used to update the request object sent to your API regarding authentication. 

- #### Input:

    ```
    context: { 
        action: "VERIFY_EMAIL" | "SEND_VERIFY_EMAIL" | "IS_EMAIL_VERIFIED" | "SIGN_OUT" | "SIGN_IN" | "SIGN_UP" | "SEND_RESET_PASSWORD_EMAIL" | "SUBMIT_NEW_PASSWORD" }
        requestInit: RequestInit,
        url: string
    }
    ```

- #### Output:

    ```
    Promise<{ RequestInit, url }>
    ```
    - Modify the `requestInit` and `url` at your will before returning it as a response.

- #### Example:

    ```js
    SuperTokens.init({
        appInfo: {...},
        recipeList: [
            EmailPassword.init({
                preAPIHook(context) {

                    // you can add query params to the url by appending them to context.url 

                    switch(context.action) {
                        case "SIGN_UP":
                            context.requestInit.headers["new-user"] = true;
                            break;
                        case "SIGN_IN":
                            if (context.requestInit.body) {
                                const newBody = {
                                    ...JSON.parse(context.requestInit.body),
                                    custom: "custom"
                                }
                                context.requestInit.body = JSON.stringify(newBody)
                            }
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
    context: { 
        action: "SUCCESS",
        redirectToPath?: string
    } | {
        action: "SIGN_IN_AND_UP" | "VERIFY_EMAIL" | "RESET_PASSWORD" 
    }
    ```

    <div class="specialNote" style="margin-bottom: 40px">
        When provided, `redirectToPath` correspond to the intended path the user wanted to reach before getting redirected to authentication. For example, if a user tries to visit `/posts/1/comments/35` without being sign in, they will get redirected to sign in page. After they successfully authenticated, you can use `redirectToPath` to redirect to the intended mentionned above path `/posts/1/comments/35`. This is the default behaviour.
    </div>


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
                        case "SUCCESS":
                            return context.redirectToPath === undefined ? "/dashboard" : context.redirectToPath;
                            break;
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



