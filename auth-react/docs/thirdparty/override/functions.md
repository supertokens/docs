---
id: functions
title: Functions
---

```js
interface RecipeInterface {

    /* 
    * Called when a user clicks on a third party provider. It should return the URL where
    * the user is to be navigated to for authentication (on the third party site).
    * 
    * @params: thirdPartyId is ID of the third party provider as seen by SuperTokens.
    *               For example, got sign in with google, the ID is "google".
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: the URL where the user is to be redirected to for authentication.
    */
    getOAuthAuthorisationURL: (input: { thirdPartyId: string; config: NormalisedConfig }) => Promise<string>;

    /* 
    * Called when then user clicks the login / sign up button for emailpassword auth.
    * Also called when the user is redirected back to the app post auth from third party
    * providers.
    * 
    * @params: thirdPartyId is ID of the third party provider as seen by SuperTokens.
    *               For example, got sign in with google, the ID is "google".
    *          config is the config provided by the user when calling the init function of this recipe
    * 
    * @returns: "OK" on success along with the User object
    *           "NO_EMAIL_GIVEN_BY_PROVIDER" in case the third party provider did not return an email
    *           "GENERAL_ERROR" in case of a "something went wrong" generic error
    *           "FIELD_ERROR" in case of a custom error that should be shown to the user
    */
    signInAndUp: (input: { thirdPartyId: string; config: NormalisedConfig }) => Promise<
        | {
              status: "OK";
              user: User;
              createdNewUser: boolean;
          }
        | {
              status: "NO_EMAIL_GIVEN_BY_PROVIDER" | "GENERAL_ERROR";
          }
        | {
              status: "FIELD_ERROR";
              error: string;
          }
    >;

    /* 
    * Called when the user clicks a social provider option. It is supposed save 
    * the state  and redirect the user to the third party provider's site.
    * 
    * @params: thirdPartyId is ID of the third party provider as seen by SuperTokens.
    *               For example, got sign in with google, the ID is "google".
    *          config is the config provided by the user when calling the init function of this recipe
    *          state is the OAuth state that can be retrieved after a successful auth
    *          from the third party provider's site.
    * 
    * @returns: See the type definition below
    */
    redirectToThirdPartyLogin: (input: {
        thirdPartyId: string;
        config: NormalisedConfig;
        state?: StateObject;
    }) => Promise<{ status: "OK" | "ERROR" }>;
}
```

## Supporting Types
```js
type StateObject = {
    state?: string;
    rid?: string;
    thirdPartyId?: string;
    redirectToPath?: string;
};
```