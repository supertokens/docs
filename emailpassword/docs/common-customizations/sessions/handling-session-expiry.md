---
id: handling-session-expiry
title: Handling session expiry
hide_title: true
---

# Handling session expiry
There are two scenarios in which session is removed:
1. When session expires
2. When user signs out

This is used to respond to first scenario, **when session expires**.

## Using `EmailPasswordAuth` component
When you use `EmailPasswordAuth` to provide `SessionContext` to your components,
you can pass function in `onSessionExpired` prop. This function will be called when session expires.

```tsx
const App = () => {
    return (
        <EmailPasswordAuth onSessionExpired={showSessionExpiredPopup}>
            <MyComponent />
        </EmailPasswordAuth>
    );
}
```

> You will need to either reload the current page or redirect the user to the sign in page if you provide this callback.

Read more about `EmailPasswordAuth` and `onSessionExpired` in [its API reference](/docs/auth-react/docs/emailpassword/email-password-auth).
