---
id: version-6.0.X-init
title: init
hide_title: true
original_id: init
---

# ``init(config)``
You can customize the EmailPassword module by overwriting the following configs:


```js
EmailPassword.init({
    signUpFeature?: {
        formFields?: {
            id: string,
            validate?: (value: any) => Promise<string | undefined>,
            optional?: boolean,
        }[]
    },
    resetPasswordUsingTokenFeature?: {
        getResetPasswordURL?: (user: User) => Promise<string>,
        createAndSendCustomEmail?: (user: User, passwordResetURLWithToken: string) => Promise<void>
    },
    emailVerificationFeature: {
        getEmailVerificationURL?: (user: User) => Promise<string>,
        createAndSendCustomEmail?: (user: User, emailVerificationURLWithToken: string) => Promise<void>
    },
    override?: {
      apis?: function,
      functions?: function
    }
})
        
```

### Parameters
- ``config``
  - ``signUpFeature``
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
  - ``resetPasswordUsingTokenFeature``
    - ``getResetPasswordURL`` (Optional)
      - type: ``(user: User) => Promise<string>;``
      - description: Callback for the reset password URL
    - ``createAndSendCustomEmail`` (Optional)
      - type: ``(user: User, passwordResetURLWithToken: string) => Promise<void>`` 
      - description: Callback for creating and sending custom emails for password reset.
  - ``emailVerificationFeature``
    - ``getEmailVerificationURL`` (Optional)
      - type: ``(user: User) => Promise<string>;``
      - description: Callback for the email verification URL
    - ``createAndSendCustomEmail`` (Optional)
      - type: ``(user: User, emailVerificationURLWithToken: string) => Promise<void>`` 
      - description: Callback for creating and sending custom emails for email verification.
  - `override`
    - type: `object of function`
    - description: Use this feature to override how this recipe behaves

### Additional Information
- The ``User`` object mentioned above is a reference to this [User](https://github.com/supertokens/core-driver-interface/wiki#user) object

