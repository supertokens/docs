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
}
```