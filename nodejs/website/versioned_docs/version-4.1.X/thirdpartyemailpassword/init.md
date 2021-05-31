---
id: version-4.1.X-init
title: init
hide_title: true
original_id: init
---

# init

You can customize the ThirdPartyEmailPassword module by overwriting the following configs:

```js
ThirdPartyEmailPassword.init({
    sessionFeature?: {
        setJwtPayload?: (user: User, context: TypeContextEmailPassword | TypeContextThirdParty, action: "signin" | "signup") => 
        Promise<{ [key: string]: any } | undefined>,
        setSessionData?: (user: User, context: TypeContextEmailPassword | TypeContextThirdParty, action: "signin" | "signup") => 
        Promise<{ [key: string]: any } | undefined>
    },
    signUpFeature?: {
        disableDefaultImplementation?: boolean,
        formFields?: {
            id: string,
            validate?: (value: any) => Promise<string | undefined>,
            optional?: boolean,
        }[],
        handlePostSignUp?: (user: User, context: TypeContextEmailPassword | TypeContextThirdParty) => Promise<void>
    },
    signInFeature?: {
        disableDefaultImplementation?: boolean,
        handlePostSignIn?: (user: User, context: TypeContextThirdParty) => Promise<void>
    },
    signOutFeature?: {
        disableDefaultImplementation?: boolean
    },
    providers?: TypeProvider[],
    resetPasswordUsingTokenFeature?: {
        disableDefaultImplementation?: boolean,
        getResetPasswordURL?: (user: User) => Promise<string>,
        createAndSendCustomEmail?: (user: User, passwordResetURLWithToken: string) => Promise<void>
    },
    emailVerificationFeature: {
        disableDefaultImplementation?: boolean,
        getEmailVerificationURL?: (user: User) => Promise<string>,
        createAndSendCustomEmail?: (user: User, emailVerificationURLWithToken: string) => Promise<void>,
        handlePostEmailVerification?: (user: User) => Promise<void>;
    }
})
        
```

### Parameters
- ``config``
  - `sessionFeature`
    - `setJwtPayload` (Optional)
      - type: `(user: User, context: TypeContextEmailPassword | TypeContextThirdParty, action: "signin" | "signup") => Promise<{ [key: string]: any } | undefined>`
      - description: The default value for JWT payload when a session is created is `{}`. Configuring `setJWTPayload` allows you to change the default JWT payload value.
    - `setSessionData` (Optional)
      - type: `(user: User, context: TypeContextEmailPassword | TypeContextThirdParty, action: "signin" | "signup") => Promise<{ [key: string]: any } | undefined>`
      - description: The default value for session data when a session is created is `{}`. Configuring `setSessionData` allows you to change the default session data value.
  - ``signUpFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disables the default sign up API.
    - ``formFields`` (Optional)
      - ``id``
        - type: ``string``
        - description: Id for the custom form field.
      - ``validate`` (Optional)
        - type: ``(value: any) => Promise<string | undefined>``
        - description: Custom validator for form field entry.
      - ``optional`` (Optional)
        - type: ``boolean``
        - description: Set the custom field to be optional or not.
      - ``handlePostSignUp`` (Optional)
        - type: `` (user: User, context: TypeContextEmailPassword | TypeContextThirdParty) => Promise<void>``
        - description: Callback for performing actions after user has been created. Depending on which login type (emailpassword/thirdparty) used, the value of context will change. 
  - ``signInFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disables the default sign in API.
    - ``handlePostSignIn`` (Optional)
      - type: ``(user: User, context: TypeContextThirdParty) => Promise<void>``
      - description: Callback for performing actions after user has signed in.
  - ``signOutFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disable the default logout API
  - `providers`
      - type: `TypeProvider[]`
        - `TypeProvider`
        - type: `{
                    id: string,
                    get: (redirectURI: string, authCodeFromRequest: string | undefined) => Promise<TypeProviderGetResponse>
                }`
        - description: Object to initialize a thirdparty provider supported by the backend.
  - ``resetPasswordUsingTokenFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disables the default send reset password email API.
    - ``getResetPasswordURL`` (Optional)
      - type: ``(user: User) => Promise<string>;``
      - description: Callback for the reset password URL
    - ``createAndSendCustomEmail`` (Optional)
      - type: ``(user: User, passwordResetURLWithToken: string) => Promise<void>`` 
      - description: Callback for creating and sending custom emails for password reset.
  - ``emailVerificationFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disables the default send email for email verification API.
    - ``getEmailVerificationURL`` (Optional)
      - type: ``(user: User) => Promise<string>;``
      - description: Callback for the email verification URL
    - ``createAndSendCustomEmail`` (Optional)
      - type: ``(user: User, emailVerificationURLWithToken: string) => Promise<void>`` 
      - description: Callback for creating and sending custom emails for email verification.

### Throws
- [GENERAL_ERROR](./../errors/general_error)

### Additional Information
- The ``User`` object mentioned above is a reference to this [User](https://github.com/supertokens/core-driver-interface/wiki#third-party-email-password-user) object
