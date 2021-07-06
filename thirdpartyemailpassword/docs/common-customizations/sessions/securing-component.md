---
id: securing-component
title: Securing a website route / component
hide_title: true
---

# Securing a website route / component
You may want to prevent rendering of some part of UI, or a route, when
there's no session.

To achieve that, wrap the component tree in `ThirdPartyEmailPasswordAuth`. When there's no session, rendering this component
will cause user to be redirected to a route, where they may sign in.

```tsx
const App = () => {
    return (
        <ThirdPartyEmailPasswordAuth>
            {/* MyComponent will be displayed only if session exists */}
            <MyComponent />
        </ThirdPartyEmailPasswordAuth>
    );
}
```

Read more about `ThirdPartyEmailPasswordAuth` [its API reference](/docs/auth-react/docs/thirdpartyemailpassword/third-party-email-password-auth).
