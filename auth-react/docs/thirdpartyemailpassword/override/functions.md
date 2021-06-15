---
id: functions
title: Functions
---

```js
interface RecipeInterface {

    /* 
    * Called when the user submits a new password after clicking on the 
    * password reset link.
    * 
    * @params: formFields contains the password entered by the user
    *          token is the password reset token
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: "OK" on success, 
    *           "RESET_PASSWORD_INVALID_TOKEN_ERROR" in case of an invalid token
    *           "FIELD_ERROR" in case of an in valid password format.
    */
    submitNewPassword: (input: {
        formFields: {
            id: string;
            value: string;
        }[];
        token: string;
        config: EPConfig;
    }) => Promise<
        | {
              status: "OK" | "RESET_PASSWORD_INVALID_TOKEN_ERROR";
          }
        | {
              status: "FIELD_ERROR";
              formFields: {
                  id: string;
                  error: string;
              }[];
          }
    >;

    sendPasswordResetEmail: (input: {
        formFields: {
            id: string;
            value: string;
        }[];
        config: EPConfig;
    }) => Promise<
        | {
              status: "OK";
          }
        | {
              status: "FIELD_ERROR";
              formFields: {
                  id: string;
                  error: string;
              }[];
          }
    >;

    doesEmailExist: (input: { email: string; config: EPConfig }) => Promise<boolean>;

    getOAuthAuthorisationURL: (input: { thirdPartyId: string; config: TPConfig }) => Promise<string>;

    signInAndUp: (input: SignInAndUpInput) => Promise<SignInAndUpOutput>;

    getOAuthState(): StateObject | undefined;

    setOAuthState(state: StateObject): void;

    redirectToThirdPartyLogin: (input: {
        thirdPartyId: string;
        config: TPConfig;
        state?: StateObject;
    }) => Promise<{ status: "OK" | "ERROR" }>;
}
```