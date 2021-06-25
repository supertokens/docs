---
id: usage
title: How to use
hide_title: true
---

# How to use

1. Go to a place where you run `ThirdParty.init(...)` to configure the recipe.
2. Component overrides can be configured at `override.components` config object path.
3. Pick component that you'd like to override by its key.
4. At component's key supply a function that returns React component.

### Example
<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```tsx
ThirdParty.init({
    override: {
        components: {
            /**
             * In this case, the <ThirdPartySignUpFooter> will render the original component
             * wrapped in div with octocat picture above it.
             */
            ThirdPartySignUpFooter: (OriginalComponent) => (originalProps) => {
                return (
                    <div>
                        <img src="octocat.jpg" />
                        <OriginalComponent {...props} />
                    </div>
                );
            },
        },
        emailVerification: {
            components: {
                // Please refer to Overriding email verification components below
            }
        }
    }
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

### Which component I can override?
For the full list of components available for override in `ThirdParty` recipe, refer to
[auth-react ThirdParty override docs](/docs/auth-react/docs/thirdparty/override/components).

### 🔍 Finding which component will be overridden
To do that, you should use React Developer Tools extension which provides a component tree inspector.
In this inspector look for components specified above.

#### Example
<img src="/docs/static/assets/emailpassword/override/find-component.png" />

1. Look for the names defined in component override config
2. Ensure that's the component you want to override
3. Provide an override function

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```tsx
ThirdParty.init({
    ...,
    override: {
        components: {
            ThirdPartySignUpFooter: (OriginalComponent) => (originalProps) => {
                return <CustomComponent {...originalProps} />
            },
        }
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->

### 🖋️ The signature of override function
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

### 📧 Overriding email verification components
You can also override components related to email verification.
To do that, nest the override configuration like:

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```tsx
ThirdParty.init({
    override: {
        emailVerification: {
            components: {
                EmailVerificationSendVerifyEmail: (OriginalComponent) => (originalProps) => {
                    return <div>
                        <OriginalComponent {...originalProps} />
                    <div>
                }
            }
        }
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->

For the full list refer to [auth-react EmailVerification override docs](/docs/auth-react/docs/emailverification/override/components).
