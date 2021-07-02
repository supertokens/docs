---
id: securing-component
title: Securing component
hide_title: true
---

# Securing a component
You may want to prevent rendering of some part of UI, or a route, when
there's no session.

To achieve that, wrap the component tree in `EmailPasswordAuth`. When there's no session, rendering this component
will cause user to be redirected to a route, where they may sign in.

```tsx
const App = () => {
    return (
        <EmailPasswordAuth>
            {/* MyComponent will be displayed only if session exists */}
            <MyComponent />
        </EmailPasswordAuth>
    );
}
```

Read more about `EmailPasswordAuth` and `requireAuth` in [its API reference](/docs/auth-react/docs/emailpassword/email-password-auth).
