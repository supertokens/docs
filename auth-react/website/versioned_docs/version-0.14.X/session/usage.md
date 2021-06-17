---
id: version-0.14.X-usage
title: Usage
hide_title: true
original_id: usage
---

# Using Session

Session recipe is integrated with the EmailPassword recipe. That means that when a user signs in, it automatically creates a secure session for that user.

The Session module is essentially a wrapper around the `supertokens-website` [session management package](/docs/website/installation).

If you were using this package and would like to upgrade to use supertokens-auth-react, please contact us at [founders@supertokens.io](mailto:founders@supertokens.io)


## Reference guide


### doesSessionExist

- #### Description:

    Use `doesSessionExist` when you want to know if a user is logged in or not.

- #### Output:

    `Promise<bool>`

- #### Example:

    ```js
        import {doesSessionExist} from 'supertokens-auth-react/recipe/session';

        const isLoggedIn = await doesSessionExist();
    ```


### getUserId

- #### Description:

    Return user id

- #### Output:

    `Promise<string>`

- #### Example:

    ```js
        import {getUserId} from 'supertokens-auth-react/recipe/session';

        const userId = await getUserId();
    ```



### getRefreshURLDomain

- #### Description:

    Return refresh URL Domain

- #### Output:

    `string`

- #### Example:

    ```js
        import {getRefreshURLDomain} from 'supertokens-auth-react/recipe/session';

        const refreshUrlDomain = getRefreshURLDomain();
    ```

### getJWTPayloadSecurely

- #### Description:

    Return user JWT Payload

- #### Output:

    `Promise<any>`

- #### Example:

    ```js
        import {getJWTPayloadSecurely} from 'supertokens-auth-react/recipe/session';

        const userJWTPayload = await getJWTPayloadSecurely();
    ```

### attemptRefreshingSession

- #### Description:

    Attempt to refresh session

- #### Output:

    `Promise<any>`

- #### Example:

    ```js
        import {attemptRefreshingSession} from 'supertokens-auth-react/recipe/session';

        const hasRefreshedSession = await attemptRefreshingSession();
    ```



### addAxiosInterceptors

- #### Description:

    Return user JWT Payload. Call this function once when your application starts if you are using axios to communicate with your API.

- #### Example:

    ```js
        import {addAxiosInterceptors} from 'supertokens-auth-react/recipe/session';
        import axios from "axios";

        addAxiosInterceptors(axios);
    ```