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
    *           "FIELD_ERROR" in case of an invalid password format.
    */
    submitNewPassword: (input: {
        formFields: {
            id: string;
            value: string;
        }[];
        token: string;
        config: NormalisedConfig;
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
    *           "FIELD_ERROR" in case of an invalid email format.
    */
    sendPasswordResetEmail: (input: {
        formFields: {
            id: string;
            value: string;
        }[];
        config: NormalisedConfig;
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
    doesEmailExist: (input: { email: string; config: NormalisedConfig }) => Promise<boolean>;

    /* 
    * Called when the user clicks on the sign up button
    * 
    * @params: formFields is the key and value of the inputs provided by the user including their email and password.
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: "OK"  if sign up was successful.
    *           "FIELD_ERROR" in case any of the input fields are incorrect.
    */
    signUp: (input: {
        formFields: {
            id: string;
            value: string;
        }[];
        config: NormalisedConfig;
    }) => Promise<
        | {
              status: "OK";
              user: User;
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
    * Called when the user clicks on the sign in button
    * 
    * @params: formFields contains the input email and password.
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: "OK" if sign in was successful.
    *           "FIELD_ERROR" in case any of the input fields are incorrect.
    *           "WRONG_CREDENTIALS_ERROR" if the input email password combination is incorrect.
    */
    signIn: (input: {
        formFields: {
            id: string;
            value: string;
        }[];
        config: NormalisedConfig;
    }) => Promise<
        | {
              status: "OK";
              user: User;
          }
        | {
              status: "FIELD_ERROR";
              formFields: {
                  id: string;
                  error: string;
              }[];
          }
        | {
              status: "WRONG_CREDENTIALS_ERROR";
          }
    >;
}
```