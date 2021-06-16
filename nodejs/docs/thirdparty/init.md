---
id: init
title: init
hide_title: true
---

# ``init(config)``
You can customize the Thirdparty module by overwriting the following configs:


```js
ThirdParty.init({
    signInAndUpFeature: {
        providers: TypeProvider[]
    },
    emailVerificationFeature?: {
        getEmailVerificationURL?: (user: User) => Promise<string>,
        createAndSendCustomEmail?: (user: User, emailVerificationURLWithToken: string) => Promise<void>,
    },
    override?: {
      functions?: function,
      apis?: function
    }
})
```

### Parameters
- `config`
  - `signInUpFeature` (Optional)
    - `providers`
      - type: `TypeProvider[]`
        - `TypeProvider`
        - type: `{
                    id: string,
                    get: (redirectURI: string, authCodeFromRequest: string | undefined) => Promise<TypeProviderGetResponse>
                }`
        - description: Object to initialize a thirdparty provider supported by the backend.
  - `emailVerificationFeature`
    - `getEmailVerificationURL` (Optional)
      - type: `(user: User) => Promise<string>`
      - description: Callback for the email verification URL
    - `createAndSendCustomEmail` (Optional)
      - type: `(user: User, emailVerificationURLWithToken: string) => Promise<void>` 
      - description: Callback for creating and sending custom emails for email verification.
  - `override`
    - type: `object of function`
    - description: Use this feature to override how this recipe behaves