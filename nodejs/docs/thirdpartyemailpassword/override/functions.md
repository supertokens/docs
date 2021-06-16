---
id: functions
title: Overriding Functions
hide_title: true
---

```js
interface RecipeInterface {
    getUserById(input: { userId: string }): Promise<User | undefined>;

    getUserByThirdPartyInfo(input: { thirdPartyId: string; thirdPartyUserId: string }): Promise<User | undefined>;

    getUsersOldestFirst(input: {
        limit?: number;
        nextPaginationToken?: string;
    }): Promise<{
        users: User[];
        nextPaginationToken?: string;
    }>;

    getUsersNewestFirst(input: {
        limit?: number;
        nextPaginationToken?: string;
    }): Promise<{
        users: User[];
        nextPaginationToken?: string;
    }>;

    getUserCount(): Promise<number>;

    signInUp(input: {
        thirdPartyId: string;
        thirdPartyUserId: string;
        email: {
            id: string;
            isVerified: boolean;
        };
    }): Promise<
        | { status: "OK"; createdNewUser: boolean; user: User }
        | {
              status: "FIELD_ERROR";
              error: string;
          }
    >;

    signUp(input: {
        email: string;
        password: string;
    }): Promise<{ status: "OK"; user: User } | { status: "EMAIL_ALREADY_EXISTS_ERROR" }>;

    signIn(input: {
        email: string;
        password: string;
    }): Promise<{ status: "OK"; user: User } | { status: "WRONG_CREDENTIALS_ERROR" }>;

    getUserByEmail(input: { email: string }): Promise<User | undefined>;

    createResetPasswordToken(input: {
        userId: string;
    }): Promise<{ status: "OK"; token: string } | { status: "UNKNOWN_USER_ID" }>;

    resetPasswordUsingToken(input: {
        token: string;
        newPassword: string;
    }): Promise<{ status: "OK" | "RESET_PASSWORD_INVALID_TOKEN_ERROR" }>;
}
```