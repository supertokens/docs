---
id: session-auth
title: Session Auth wrapper
hide_title: true
---

# Session Auth wrapper

The `SessionAuth` component is used to wrap any component that requires the session context.
It will update the context if any of these events happens:
- App is loaded or reloaded
- User signs in
- User signs out
- Session expires
- Session is refreshed

Reading `SessionContext` returns an object:
```ts
type SessionContextType = {
    doesSessionExist: boolean,
    userId: string,
    jwtPayload: any /* JSON object set on the backend */
}
```

#### How do I read `SessionContext` in my component?
Wrap the component in `SessionAuth` with no parameters.
```js
const App = () => {
__HIGHLIGHT__    return (
        <SessionAuth>
            <Dashboard />
        </SessionAuth>
    ); __END_HIGHLIGHT__
};

const Dashboard = () => {
    const { doesSessionExist, userId, jwtPayload } = useContext(SessionContext);

    return <>dashboard contents</>;
};
```

## Detailed usage
### Receive session updates
`SessionAuth` updates `SessionContext` whenever one of events mentioned before happens.

Example:
```tsx
const App = () => {
    return (
        <SessionAuth>
            <MyComponent />
        </SessionAuth>
    );
}

const MyComponent = () => {
    const { doesSessionExist, userId, jwtPayload } = useContext(SessionContext);

    return <>I receive session updates</>;
}
```

### Prevent rendering if there's no session
To do that, set `requireAuth` prop to `true`.
This requires passing the `redirectToLogin` prop.

Example:
```tsx
const App = () => {
    return (
        <SessionAuth requireAuth={true} redirectToLogin={() => {/* redirect */}}>
            <IWillRenderIfSessionExists />
        </SessionAuth>
    );
};
```

### Respond to session expiry
If you pass function as `onSessionExpired` prop, it will be called whenever session expires.
**When session expires this will prevent `SessionContext` from updating**. This means you can still display the UI for authenticated user.

Example:
```tsx
const App = () => {
    return (
        <SessionAuth onSessionExpired={displayPopupAndRedirect}>
            {/* when session expires, this component won't receive SessionContext update */}
            <MyComponent />
        </SessionAuth>
    );
}
```

It's possible to combine it with previous `requireAuth` and `redirectToLogin` props.

#### Note on nesting `SessionAuth`
`SessionAuth` can be nested. This means that you can use `SessionAuth` as a child of another `SessionAuth`.

Example:
```tsx
const App = () => {
    return (
        <SessionAuth>
            <NormalComponent />
            <SessionAuth requireAuth={true} redirectToLogin={() => { /* redirect */ }}>
                <ProtectedComponent />
            </SessionAuth>
        </SessionAuth>
    );
}
```
