---
id: version-6.0.X-apis
title: Overriding APIs
original_id: apis
---

```js
interface APIInterface {
    /* 
    * Called before sign up to know if a user is already created for the given email address
    * 
    * @method: GET
    * 
    * @params: set it to undefined to disable the API.
    *          email
    *          options: see APIOptions below
    * 
    * @returns: "OK" and boolean value true if email already exists else false
    */
    emailExistsGET:
        | undefined
        | ((input: {
              email: string;
              options: APIOptions;
          }) => Promise<{
              status: "OK";
              exists: boolean;
          }>);

    /* 
    * Called when a password reset token needs to be generated for the user.
    * The default implementation calls the recipe function `createAndSendCustomEmail`
    * to send the the reset token mail.
    * 
    * @method: POST
    * 
    * @params: set it to undefined to disable the API.
    *          formFields will have email
    *          options: see APIOptions below
    * 
    * @returns: "OK": on successfully generating the password reset token
    */
    generatePasswordResetTokenPOST:
        | undefined
        | ((input: {
              formFields: {
                  id: string;
                  value: string;
              }[];
              options: APIOptions;
          }) => Promise<{
              status: "OK";
          }>);

    /* 
    * Called to verify the password reset token and update the password
    * of the user
    * 
    * @method: POST
    * 
    * @params: set it to undefined to disable the API.
    *          formFields will have the new updated password
    *          token is the password reset token
    *          options: see APIOptions below
    * 
    * @returns: "OK": on successfully verifying reset token and updating user's password
    *           "RESET_PASSWORD_INVALID_TOKEN_ERROR": if password reset token is invalid
    */
    passwordResetPOST:
        | undefined
        | ((input: {
              formFields: {
                  id: string;
                  value: string;
              }[];
              token: string;
              options: APIOptions;
          }) => Promise<{
              status: "OK" | "RESET_PASSWORD_INVALID_TOKEN_ERROR";
          }>);

    /* 
    * The API will take email and password the verify that the user exists and
    * returns the user object.
    * 
    * @method: POST
    * 
    * @params: set it to undefined to disable the API.
    *          formFields will have the email and the password
    *          options: see APIOptions below
    * 
    * @returns: "OK" and user object: on successfully verifying email and password
    *           "WRONG_CREDENTIALS_ERROR": if password is invalid or no account info found for the given email
    */
    signInPOST:
        | undefined
        | ((input: {
              formFields: {
                  id: string;
                  value: string;
              }[];
              options: APIOptions;
          }) => Promise<
              | {
                    status: "OK";
                    user: User;
                }
              | {
                    status: "WRONG_CREDENTIALS_ERROR";
                }
          >);

    /* 
    * Called to sign-up a new user.
    * 
    * @method: POST
    * 
    * @params: set it to undefined to disable the API.
    *          formFields will have the email and the password
    *          options: see APIOptions below
    * 
    * @returns: "OK" and user object: on successfully signing up the user
    *           "EMAIL_ALREADY_EXISTS_ERROR": if a user account already exists for the given email
    */
    signUpPOST:
        | undefined
        | ((input: {
              formFields: {
                  id: string;
                  value: string;
              }[];
              options: APIOptions;
          }) => Promise<
              | {
                    status: "OK";
                    user: User;
                }
              | {
                    status: "EMAIL_ALREADY_EXISTS_ERROR";
                }
          >);
}
```

## Supporting Types
```ts
interface APIOptions {
    recipeImplementation: RecipeInterface;
    config: TypeNormalisedInput;
    recipeId: string;
    isInServerlessEnv: boolean;
    req: Request;
    res: Response;
    next: NextFunction;
}

interface User {
    id: string;
    email: string;
    timeJoined: number;
};
```