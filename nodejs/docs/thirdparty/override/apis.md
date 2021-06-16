---
id: apis
title: Overriding APIs
hide_title: true
---

```js
interface APIInterface {
    /* 
    * Called to get the authorisation URL for the thirdparty sign-up/sign-in flow
    * 
    * @method: GET
    * 
    * @params: set it to undefined to disable the API.
    *          provider
    *          options: see APIOptions below
    * 
    * @returns: "OK" and url on success
    */
    authorisationUrlGET:
        | undefined
        | ((input: {
              provider: TypeProvider;
              options: APIOptions;
          }) => Promise<{
              status: "OK";
              url: string;
          }>);

    /* 
    * Called to sign-up a new user or sign-in an existing user
    * 
    * @method: POST
    * 
    * @params: set it to undefined to disable the API.
    *          provider
    *          code: authorisation code returned after using authorisation url
    *          redirectURI: URI to direct to after successful sign-up/sign-in
    *           options: see APIOptions below
    * 
    * @returns: "OK": on successfully signing up or signing in the user
    *           "NO_EMAIL_GIVEN_BY_PROVIDER": if thirdparty provider used in the API doesn't return email of the user
    *           "FIELD_ERROR": if there is any field error during thirdparty signup/signin flow
    */
    signInUpPOST:
        | undefined
        | ((input: {
              provider: TypeProvider;
              code: string;
              redirectURI: string;
              options: APIOptions;
          }) => Promise<
              | {
                    status: "OK";
                    createdNewUser: boolean;
                    user: User;
                    authCodeResponse: any;
                }
              | { status: "NO_EMAIL_GIVEN_BY_PROVIDER" }
              | {
                    status: "FIELD_ERROR";
                    error: string;
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
    providers: TypeProvider[];
    req: Request;
    res: Response;
    next: NextFunction;
}

interface TypeProvider {
    id: string;
    get: (redirectURI: string | undefined, authCodeFromRequest: string | undefined) => Promise<TypeProviderGetResponse>;
}
```