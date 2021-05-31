---
id: version-4.0.X-init
title: init
hide_title: true
original_id: init
---

# ``init(config)``
You can customize the Thirdparty module by overwriting the following configs:


```js
ThirdParty.init({
    signInAndUpFeature: {
        disableDefaultImplementation?: boolean,
        handlePostSignUpIn?: (user: User, thirdPartyAuthCodeResponse: any) => Promise<void>,
        providers: TypeProvider[]
    },
    signOutFeature?: {
        disableDefaultImplementation?: boolean
    },
    emailVerificationFeature?: {
        disableDefaultImplementation?: boolean,
        getEmailVerificationURL?: (user: User) => Promise<string>,
        createAndSendCustomEmail?: (user: User, emailVerificationURLWithToken: string) => Promise<void>,
        handlePostEmailVerification?: (user: User) => Promise<void>
    }
})
```

### Parameters
- `config`
  - `signInUpFeature` (Optional)
    - `disableDefaultImplementation`
      - type: `boolean`
      - description: Disables the default signInUp API.`
    - `handlePostSignUpIn` (Optional)
      - type: `(user: User, thirdPartyAuthCodeResponse: any) => Promise<void>`
      - description: Callback excecuted after signup/signin.
    - `providers`
      - type: `TypeProvider[]`
        - `TypeProvider`
        - type: `{
                    id: string,
                    get: (redirectURI: string, authCodeFromRequest: string | undefined) => Promise<TypeProviderGetResponse>
                }`
        - description: Object to initialize a thirdparty provider supported by the backend.
  - `signOutFeature` (Optional)
    - `disableDefaultImplementation`
      - type: `boolean`
      - description: Disables the default signout API.
   - `emailVerificationFeature`
    - `disableDefaultImplementation` (Optional)
      - type: ``boolean``
      - description: Disables the default email verification APIs.
    - `getEmailVerificationURL` (Optional)
      - type: `(user: User) => Promise<string>`
      - description: Callback for the email verification URL
    - `createAndSendCustomEmail` (Optional)
      - type: `(user: User, emailVerificationURLWithToken: string) => Promise<void>` 
      - description: Callback for creating and sending custom emails for email verification.