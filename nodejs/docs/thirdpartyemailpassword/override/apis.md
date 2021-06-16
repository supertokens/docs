---
id: apis
title: Overriding APIs
hide_title: true
---

```js
APIInterface {
    authorisationUrlGET:
        | undefined
        | ((input: {
              provider: TypeProvider;
              options: ThirdPartyAPIOptions;
          }) => Promise<{
              status: "OK";
              url: string;
          }>);

    emailExistsGET:
        | undefined
        | ((input: {
              email: string;
              options: EmailPasswordAPIOptions;
          }) => Promise<{
              status: "OK";
              exists: boolean;
          }>);

    generatePasswordResetTokenPOST:
        | undefined
        | ((input: {
              formFields: {
                  id: string;
                  value: string;
              }[];
              options: EmailPasswordAPIOptions;
          }) => Promise<{
              status: "OK";
          }>);

    passwordResetPOST:
        | undefined
        | ((input: {
              formFields: {
                  id: string;
                  value: string;
              }[];
              token: string;
              options: EmailPasswordAPIOptions;
          }) => Promise<{
              status: "OK" | "RESET_PASSWORD_INVALID_TOKEN_ERROR";
          }>);

    signInUpPOST: undefined | ((input: SignInUpAPIInput) => Promise<SignInUpAPIOutput>);
}
```