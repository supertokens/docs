---
id: about
title: About
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./thirdpartyemailpassword/advanced-customizations/backend-functions-override/about.md -->

# About backend functions override

Overriding of the functions will allow you to change the behaviour of the functions that are used by the backend APIs exposed via our SDK. Example functions are:
- Sign in / up
- Creating / Revoking a session
- Signing out
- And more...

### Some common use cases:
- You already have your own sign-up/sign-in flow and want to migrate to Supertokens. Overriding the functions will allow you to let the old users sign-in via your custom logic and let new users sign-up/sign-in via Supertokens.
- You want to use your own custom userId format. Overriding various functions will make your task easier.
