---
id: about
title: About
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./thirdpartyemailpassword/advanced-customizations/frontend-functions-override/about.md -->

# About frontend functions override

This feature allows you to change the behaviour of a recipe on the frontend by allowing you to override the core functions used by the UI components for actions such as:
- Sign in / up
- Saving a session
- Signing out
- And more...

## An example
- If a recipe wants to check if a session exists, it will call the session recipe's `doesSessionExist` function.
- In the default implementation of the session recipe, we check this via a token stored in the localstorage (this is not a sensitive token).
- However, if you implement your own session management, you can override this function on the frontend to work with your solution, and all the other recipes that use this function, will continue to work as expected.
