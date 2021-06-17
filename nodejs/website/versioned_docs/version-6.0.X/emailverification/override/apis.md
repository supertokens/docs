---
id: version-6.0.X-apis
title: Overriding APIs
original_id: apis
---

```ts
interface APIInterface {
    /* 
    * Called to the verify email verification token
    * 
    * @method: POST
    * 
    * @params: set it to undefined to disable the API.
    *          token: email verification tokenß
    *          options: see APIOptions below
    * 
    * @returns: "OK": if token is successfully verified
    *           "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR": if verification token is invalid
    */
    verifyEmailPOST:
        | undefined
        | ((input: {
              token: string;
              options: APIOptions;
          }) => Promise<{ status: "OK"; user: User } | { status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR" }>);

    /* 
    * Called to check whether the email is verified or not
    * 
    * @method: GET
    * 
    * @params: set it to undefined to disable the API
    *          options: see APIOptions below
    * 
    * @returns: "OK" and boolean stating whether email is verified or not
    */
    isEmailVerifiedGET:
        | undefined
        | ((input: {
              options: APIOptions;
          }) => Promise<{
              status: "OK";
              isVerified: boolean;
          }>);

    /* 
    * Called to generate email verification token
    * 
    * @method: POST
    * 
    * @params: set it to undefined to disable the API
    *          options: see APIOptions below
    * 
    * @returns: "OK": if token is successfully generated
    *           "EMAIL_ALREADY_VERIFIED_ERROR": if email is already verified
    */
    generateEmailVerifyTokenPOST:
        | undefined
        | ((input: { options: APIOptions }) => Promise<{ status: "EMAIL_ALREADY_VERIFIED_ERROR" | "OK" }>);
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
}
```