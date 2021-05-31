---
id: init
title: init
hide_title: true
---

# ``init(config)``
You can customize the EmailPassword module by overwriting the following configs:


```js
EmailPassword.init({
    sessionFeature?: {
        setJwtPayload?: (user: User, formFields: TypeFormField[], action: "signin" | "signup") => 
        Promise<{ [key: string]: any } | undefined>,
        setSessionData?: (user: User, formFields: TypeFormField[], action: "signin" | "signup") => 
        Promise<{ [key: string]: any } | undefined>
    },
    signUpFeature?: {
        disableDefaultImplementation?: boolean,
        formFields?: {
            id: string,
            validate?: (value: any) => Promise<string | undefined>,
            optional?: boolean,
        }[],
        handleCustomFormFieldsPostSignUp?: (user: User, formFields: { id: string; value: any }[]) => Promise<void>
    },
    signInFeature?: {
        disableDefaultImplementation?: boolean
    },
    signOutFeature?: {
        disableDefaultImplementation?: boolean
    },
    resetPasswordUsingTokenFeature?: {
        disableDefaultImplementation?: boolean,
        getResetPasswordURL?: (user: User) => Promise<string>,
        createAndSendCustomEmail?: (user: User, passwordResetURLWithToken: string) => Promise<void>
    },
    emailVerificationFeature: {
        disableDefaultImplementation?: boolean,
        getEmailVerificationURL?: (user: User) => Promise<string>,
        createAndSendCustomEmail?: (user: User, emailVerificationURLWithToken: string) => Promise<void>,
        handlePostEmailVerification?: (user: User) => Promise<void>
    }
})
        
```

### Parameters
- ``config``
  - `sessionFeature`
    - `setJwtPayload` (Optional)
      - type: `(user: User, formFields: TypeFormField[], action: "signin" | "signup") => Promise<{ [key: string]: any } | undefined>`
      - description: The default value for JWT payload when a session is created is `{}`. Configuring `setJWTPayload` allows you to change the default JWT payload value.
    - `setSessionData` (Optional)
      - type: `(user: User, formFields: TypeFormField[], action: "signin" | "signup") => Promise<{ [key: string]: any } | undefined>`
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
      - ``handleCustomFormFieldsPostSignUp`` (Optional)
        - type: ``(user: User, formFields: { id: string; value: any }[]) => Promise<void>``
        - description: Callback for handling custom form fields after user has been created.
  - ``signInFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disables the default sign in API.
  - ``signOutFeature``
    - ``disableDefaultImplementation`` (Optional)
      - type: ``boolean``
      - description: Disable the default logout API
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
- The ``User`` object mentioned above is a reference to this [User](https://github.com/supertokens/core-driver-interface/wiki#user) object

