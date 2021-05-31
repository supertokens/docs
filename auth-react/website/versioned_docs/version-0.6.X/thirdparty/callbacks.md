---
id: version-0.6.X-callbacks
title: Callbacks
original_id: callbacks
---

This page references the callbacks that you can set up in ThirdParty configs.
### preAPIHooks

- #### Description:

    `preAPIHooks` This async method can be used to update the request object sent to your API regarding authentication. 

- #### Input:

    ```
    context: { action: "VERIFY_EMAIL" | "SEND_VERIFY_EMAIL" | "IS_EMAIL_VERIFIED" | "SIGN_IN" | "GET_AUTHORISATION_URL }
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
            ThirdParty.init({
                preAPIHook(context) {
                    switch(context.action) {
                        case "SIGN_IN":
                            // At this point, we don't know if it's a sign in or sign up since third party sign in and sign up UI is similar.
                            context.requestInit.headers["sign-in-up-attempt"] = true;
                            break;
                        case "SIGN_OUT":
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
    context: { 
        action: "SUCCESS",
        isNewUser: boolean;
        redirectToPath?: string
    } | {
        action: "SIGN_IN_AND_UP" | "VERIFY_EMAIL" | "RESET_PASSWORD" 
    } | {
        action: "GET_REDIRECT_URL",
        provider: {id: string, name: string}
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
            ThirdParty.init({
                getRedirectionURL(context) {
                    switch(context.action) {
                        case "SUCCESS": {
                            if (context.isNewUser) {
                                return "/dashboard/onboarding";
                            } else {
                                return context.redirectToPath === undefined ? "/dashboard" : context.redirectToPath;
                            }
                            break;
                        }
                        case "SIGN_IN_AND_UP":
                            return "/custom-sign-in-and-up";
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
          action: "SESSION_ALREADY_EXISTS" | "VERIFY_EMAIL_SENT" | "EMAIL_VERIFIED_SUCCESSFUL";
    } | {
          
          action: "SUCCESS";
          isNewUser: boolean;
          user: { id: string; email: string };
    }
    ```

- #### Example:

    ```js
    SuperTokens.init({
        appInfo: {...},
        recipeList: [
            ThirdParty.init({
                onHandleEvent(context) {
                    switch(context.action) {
                        case "SUCCCESS":
                            let {email, id} = context.user;
                            if (context.isNewUser) {
                                // SIGN UP
                            } else {
                                // SIGN IN
                            }
                            break;
                        case "VERIFY_EMAIL_SENT":
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



