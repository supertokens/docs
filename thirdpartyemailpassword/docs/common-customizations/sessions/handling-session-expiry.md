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

## Using `ThirdPartyEmailPasswordAuth` component
When you use `ThirdPartyEmailPasswordAuth` to provide `SessionContext` to your components,
you can pass function in `onSessionExpired` prop. This function will be called when session expires.

```tsx
const App = () => {
    return (
        <ThirdPartyEmailPasswordAuth onSessionExpired={onSessionExpired}>
            <MyComponent />
        </ThirdPartyEmailPasswordAuth>
    );
}
```

### Preserving the UI on session expiry
By passing `onSessionExpired` you are preventing the update to `SessionContext` that `MyComponent` would receive
when session expires. This allows you to handle session expiry while still displaying UI for authenticated user to improve UX.

Example:
```tsx
const App = () => {
    return (
        <ThirdPartyEmailPasswordAuth onSessionExpired={displayLoginPopup}>
            <MyComponent />
        </ThirdPartyEmailPasswordAuth>
    );
};
```

If you don't specify the `onSessionExpired`, the default behaviour is redirecting the user to where they might sign in.

Read more about `ThirdPartyEmailPasswordAuth` and `onSessionExpired` in [its API reference](/docs/auth-react/docs/thirdpartyemailpassword/third-party-email-password-auth).
