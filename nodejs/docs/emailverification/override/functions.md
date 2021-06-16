---
id: functions
title: Overriding Functions
---

```ts
interface RecipeInterface {
    /* 
    * Called to generate email verification token
    * 
    * @params: email
    *          userId
    * 
    * @returns: "OK": if token is successfully generated
    *           "EMAIL_ALREADY_VERIFIED_ERROR": if email is already verified
    */
    createEmailVerificationToken(input: {
        userId: string;
        email: string;
    }): Promise<
        | {
              status: "OK";
              token: string;
          }
        | { status: "EMAIL_ALREADY_VERIFIED_ERROR" }
    >;

    /* 
    * Called to the verify email verification token
    * 
    * @params: token
    * 
    * @returns: "OK": on successfully verifying the token
    *           "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR": if verification token is invalid
    */
    verifyEmailUsingToken(input: {
        token: string;
    }): Promise<{ status: "OK"; user: User } | { status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR" }>;

    /* 
    * Called to check whether the email is verified or not
    * 
    * @params: userId
    *          email
    * 
    * @returns: "OK" and a boolean stating whether the email is verified or not
    */
    isEmailVerified(input: { userId: string; email: string }): Promise<boolean>;
}
```

## Supporting Types
```ts
interface User {
    id: string;
    email: string;
}
```