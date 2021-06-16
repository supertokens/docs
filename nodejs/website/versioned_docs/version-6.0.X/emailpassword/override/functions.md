---
id: version-6.0.X-functions
title: Overriding Functions
original_id: functions
---

```ts
interface RecipeInterface {
    /* 
    * Called to sign-up a new user
    * 
    * @params: email
    *          password
    * 
    * @returns: "OK": on successfully signing up the user
    *           "EMAIL_ALREADY_EXISTS_ERROR": if the email is already been used
    */
    signUp(input: {
        email: string;
        password: string;
    }): Promise<{ status: "OK"; user: User } | { status: "EMAIL_ALREADY_EXISTS_ERROR" }>;

    /* 
    * Called to sign-in a user
    * 
    * @params: email
    *          password
    * 
    * @returns: "OK": on successfully verifying email and password
    *           "WRONG_CREDENTIALS_ERROR": if password is invalid or no account info found for the given email
    */
    signIn(input: {
        email: string;
        password: string;
    }): Promise<{ status: "OK"; user: User } | { status: "WRONG_CREDENTIALS_ERROR" }>;

    /* 
    * Called to get user info based on userId
    * 
    * @params: userId
    * 
    * @returns: user object if a user is found for the given userId, else undefined
    */
    getUserById(input: { userId: string }): Promise<User | undefined>;

    /* 
    * Called to get user info based on email address
    * 
    * @params: email
    * 
    * @returns: user object if a user is found for the given email, else undefined
    */
    getUserByEmail(input: { email: string }): Promise<User | undefined>;

    /* 
    * Called to generate a password reset token for the user
    * 
    * @params: userId
    * 
    * @returns: "OK": on successfully generating reset password token
    *           "UNKNOWN_USER_ID": if no user found for the given userId
    */
    createResetPasswordToken(input: {
        userId: string;
    }): Promise<{ status: "OK"; token: string } | { status: "UNKNOWN_USER_ID" }>;

    /* 
    * Called to update password using password reset token
    * 
    * @params: token is the password reset token
    *          newPassword is the updated password
    * 
    * @returns: "OK": on successfully updating user's password
    *           "RESET_PASSWORD_INVALID_TOKEN_ERROR": if password reset token is invalid
    */
    resetPasswordUsingToken(input: {
        token: string;
        newPassword: string;
    }): Promise<{ status: "OK" | "RESET_PASSWORD_INVALID_TOKEN_ERROR" }>;

    /* 
    * Called to get list of users in ascending order based on their timeJoined
    * 
    * @params: limit (optional) is the number
    *          nextPaginationToken (optional) is the pagination token
    * 
    * @returns: See the type definition below
    */
    getUsersOldestFirst(input: {
        limit?: number;
        nextPaginationToken?: string;
    }): Promise<{
        users: User[];
        nextPaginationToken?: string;
    }>;

    /* 
    * Called to get list of users in descending order based on their timeJoined
    * 
    * @params: limit (optional) is the number
    *          nextPaginationToken (optional) is the pagination token
    * 
    * @returns: See the type definition below
    */
    getUsersNewestFirst(input: {
        limit?: number;
        nextPaginationToken?: string;
    }): Promise<{
        users: User[];
        nextPaginationToken?: string;
    }>;

    /* 
    * Called to get total count of the user
    */
    getUserCount(): Promise<number>;
}
```

## Supporting Types
```ts
interface User {
    id: string;
    email: string;
    timeJoined: number;
};
```