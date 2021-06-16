---
id: apis
title: Overriding APIs
hide_title: true
---

```ts
interface APIInterface {
    /* 
    * Refreshs the session if refresh token is found. If no refresh token is found or is expired,
    * the default implementation throws an unauthorised error which means the user will need to
    * sign-in again.
    * 
    * @method: POST
    * 
    * @params: set it to undefined to dsiable the API.
    *          options will contain the functions related to the recipe,
    *          recipeId, a request object, a response object, a next
    *          function, the config provided by the user when calling the init function of this recipe
    *          and a boolean stating whether the function is being called in a serverless enviroment.
    *          See APIOptions below
    * 
    * @returns: Promise
    */
    refreshPOST: undefined | (input: { options: APIOptions }) => Promise<void>;

    /* 
    * API will be called when user wants to logout from the existing session.
    * 
    * @method: POST
    * 
    * @params: set it to undefined to dsiable the API.
    *          options will contain the functions related to the recipe,
    *          recipeId, a request object, a response object, a next
    *          function, the config provided by the user when calling the init function of this recipe
    *          and a boolean stating whether the function is being called in a serverless enviroment.
    *          See APIOptions below
    * 
    * @returns: Promise
    *           {status: "OK"}: on successfully logging out the user
    */
    signOutPOST:
        | undefined
        | ((input: {
              options: APIOptions;
          }) => Promise<{
              status: "OK";
          }>);

    /* 
    * This is a middleware to be used in the API where you want to verify if an active session
    * exists or not for the API call. The default implementation will add a session object to request
    * if a active session is found in the request.
    * 
    * @params: options will contain the functions related to the recipe,
    *          recipeId, a request object, a response object, a next
    *          function, the config provided by the user when calling the init function of this recipe
    *          and a boolean stating whether the function is being called in a serverless enviroment.
    *          See APIOptions below
    *          verifySessionOptions will contain two boolean values: to enable/disable
    *          anti-csrf check and another to state if session requirement is optional
    * 
    * @returns: Promise
    */
    verifySession(input: {
        verifySessionOptions: VerifySessionOptions | undefined;
        options: APIOptions;
    }): Promise<void>;
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

interface VerifySessionOptions {
    antiCsrfCheck?: boolean;
    sessionRequired?: boolean;
}
```