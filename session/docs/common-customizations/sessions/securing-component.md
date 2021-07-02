---
id: securing-component
title: Securing component
hide_title: true
---

# Securing a component
You may want to prevent rendering of some part of UI, or a route, when
there's no session.

To achieve that, pass `requireAuth={true}` as a prop to `SessionAuth`:

```tsx
const App = () => {
    return (
        <SessionAuth requireAuth={true} redirectToLogin={() => {/* redirect */}}>
            {/* MyComponent will be displayed only if session exists */}
            <MyComponent />
        </SessionAuth>
    );
}
```

If you pass `requireAuth={true}`, you have to pass function to `redirectToLogin` prop,
which will redirect the user to where they might log in.

Read more about `SessionAuth` and `requireAuth` in [its API reference](/docs/auth-react/docs/session/session-auth).
