---
id: functions
title: Functions
---

```js
interface RecipeInterface {

    /* 
    * Called when the user submits a new password after clicking on the 
    * password reset link. This function should call an API that verifies
    * the token and saves the new password.
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

    /* 
    * Called when the user clicks on the send password email button. This function
    * should call an API that generates and sends a password reset email
    * 
    * @params: formFields contains the email entered by the user
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: "OK" on success, 
    *           "FIELD_ERROR" in case of an in valid email format.
    */
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

    /* 
    * Called during sign up to check if the entered email exists already or not
    * 
    * @params: email is the value entered by the user in the sign up form
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: true if the email already exists, else false.
    */
    doesEmailExist: (input: { email: string; config: EPConfig }) => Promise<boolean>;

    /* 
    * Called when a user clicks on a third party provider. It should return the URL where
    * the user is to be navigated to for authentication (on the third party site).
    * 
    * @params: thirdPartyId is ID of the third party provider as seen by SuperTokens.
    *               For example, got sign in with google, the ID is "google".
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: the URL where the user is to be redirected to for authentication.
    */
    getOAuthAuthorisationURL: (input: { thirdPartyId: string; config: TPConfig }) => Promise<string>;

    /* 
    * Called when then user clicks the login / sign up button for emailpassword auth.
    * Also called when the user is redirected back to the app post auth from third party
    * providers.
    * 
    * @params: If the user has used email password sign in, it contains the email,
    *          password and other form fields. Else it contains the auth code provided
    *          by the third party social login. See the type definition below
    * 
    * @returns: See the type definition below
    */
    signInAndUp: (input: SignInAndUpInput) => Promise<SignInAndUpOutput>;

    /* 
    * Called when the user clicks a social provider option. It is supposed save 
    * the state  and redirect the user to the third party provider's site.
    * 
    * @params: thirdPartyId is ID of the third party provider as seen by SuperTokens.
    *               For example, got sign in with google, the ID is "google".
    *          config is the config provided by the user when calling the init function of this recipe
    *          state is the OAuth state that can be retrieved after a successful auth
    *          from the third party provider's site.
    * 
    * @returns: See the type definition below
    */
    redirectToThirdPartyLogin: (input: {
        thirdPartyId: string;
        config: TPConfig;
        state?: StateObject;
    }) => Promise<{ status: "OK" | "ERROR" }>;
}
```

## Supporting Types
```js
type SignInAndUpInput =
    | {
          type: "emailpassword";
          isSignIn: boolean;
          formFields: {
              id: string;
              value: string;
          }[];
          config: EPConfig;
      }
    | {
          type: "thirdparty";
          thirdPartyId: string;
          config: TPConfig;
      };

type SignInAndUpOutput =
    | {
          type: "emailpassword" | "thirdparty";
          status: "OK";
          user: User;
          createdNewUser: boolean;
      }
    | {
          type: "emailpassword";
          status: "FIELD_ERROR";
          formFields: {
              id: string;
              error: string;
          }[];
      }
    | {
          type: "emailpassword";
          status: "WRONG_CREDENTIALS_ERROR";
      }
    | {
          type: "thirdparty";
          status: "NO_EMAIL_GIVEN_BY_PROVIDER" | "GENERAL_ERROR";
      }
    | {
          type: "thirdparty";
          status: "FIELD_ERROR";
          error: string;
      };

type StateObject = {
    state?: string;
    rid?: string;
    thirdPartyId?: string;
    redirectToPath?: string;
};
```