---
id: version-0.14.X-functions
title: Functions
original_id: functions
---

```js
interface RecipeInterface {
    /* 
    * Called when the user clicks on the email verification link. This function
    * is supposed to mark the email associated with this token as verified.
    * 
    * @params: token is the email verification token
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: "OK" on success, 
    *           "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR" in case of an invalid token
    */
    verifyEmail: (input: {
        token: string;
        config: NormalisedConfig;
    }) => Promise<{ status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR" | "OK" }>;

    /* 
    * Called when the user visits the email verification page and their email is not
    * already verified. You are to retrieve the email of this user from their session.
    * 
    * @params: config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: "OK" on success, 
    *           "EMAIL_ALREADY_VERIFIED_ERROR" in case their email is already verified
    */
    sendVerificationEmail: (input: {
        config: NormalisedConfig;
    }) => Promise<{ status: "EMAIL_ALREADY_VERIFIED_ERROR" | "OK" }>;

    /* 
    * Called to check if the currently logged in user's email is verified or not.
    * 
    * @params: config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: true if the email is already verified, else false.
    */
    isEmailVerified: (input: { config: NormalisedConfig }) => Promise<boolean>;
}
```