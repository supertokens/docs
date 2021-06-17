---
id: usage
title: How to use
hide_title: true
---

# How to use

1. Go to a place where you configure `EmailPassword` recipe.
2. Component overrides can be configured at `overrides.components` config object path.
3. Pick component that you'd like to override by its key.
4. At component's key supply a function that returns React component.

The available overridable components are listed below in the code snippet.

```tsx
EmailPassword.init({
    overrides: {
        components: {
            /**
             * In this case, the <EmailPasswordSignIn> will render the original component
             * wrapped in div with octocat picture above it.
             */
            EmailPasswordSignIn: (OriginalComponent) => (originalProps) => {
                return (
                    <div>
                        <img src="octocat.jpg" />
                        <OriginalComponent {...props} />
                    </div>
                );
            },
            EmailPasswordSignInFooter: ...,
            EmailPasswordSignInForm: ...,
            EmailPasswordSignInHeader: ...,
            EmailPasswordSignUp: ...,
            EmailPasswordSignUpFooter: ...,
            EmailPasswordSignUpForm: ...,
            EmailPasswordSignUpHeader: ...,
            EmailPasswordResetPasswordEmail: ...,
            EmailPasswordSubmitNewPassword: ...,

        }
    }
});
```

### 🔍 Finding which component to override
To do that, you should use React Developer Tools extension which provides a component tree inspector.
In this inspector look for components specified above.

#### Example
<img src="/docs/static/assets/emailpassword/override/find-component.png" />

1. Look for the names defined in component override config
2. Ensure that's the component you want to override
3. Provide an override function

### 🖋️ The definition of override function
Override function is a React Component factory function. It will receive original component
as a parameter, in case you want to render it. It should return a React Component, which will receive
original props.

```tsx
const overrideFn = (OriginalComponent) => React.Component<OriginalProps>
```

### 📽️ How do I render the original component
Because the override function receives the original component as a parameter,
you can render it. To do this, simply use it in JSX. Don't forget to supply original props
by spreading them.

```tsx
const overrideFn = (OriginalComponent) => (originalProps) => {
    return (
        <>
            <h1>I'm a header that you added above original component</h1>
            <OriginalComponent {...originalProps} />
        </>
    )
}
```