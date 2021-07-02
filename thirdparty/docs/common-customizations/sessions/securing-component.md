---
id: securing-component
title: Securing component
hide_title: true
---

# Securing a component
You may want to prevent rendering of some part of UI, or a route, when
there's no session.

To achieve that, wrap the component tree in `ThirdPartyAuth`. When there's no session, rendering this component
will cause user to be redirected to a route, where they may sign in.

```tsx
const App = () => {
    return (
        <ThirdPartyAuth>
            {/* MyComponent will be displayed only if session exists */}
            <MyComponent />
        </ThirdPartyAuth>
    );
}
```

Read more about `ThirdPartyAuth` in [its API reference](/docs/auth-react/docs/thirdparty/third-party-auth).
