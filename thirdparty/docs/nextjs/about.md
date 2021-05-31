---
id: about
title: About
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./thirdpartyemailpassword/docs/nextjs/about.md -->

# About

Integrating SuperTokens with a Next.js app involves:
1) Calling the frontend and backend init functions
2) Adding a website page to display the auth related widgets (on `/auth` by default)
3) Creating a serverless function to expose the auth related APIs which will be consumed by the frontend widgets (on `/api/auth/` by default)
4) Protecting website routes: Displaying them only when a user is logged in, else redirecting them to the login page
5) Performing session verification:
    - In your APIs
    - In `getServerSideProps`

Each of these will be covered in the next few pages. Rest of the customizations can be done by following the "Common customizations" section.

### An example implementation can be [found here](https://github.com/supertokens/next.js/tree/canary/examples/with-supertokens).

> This example uses the "ThirdPartyEmailPassword recipe".

You can use the above as a starting point by:

```bash
npx create-next-app --example with-supertokens with-supertokens-app
# or
yarn create next-app --example with-supertokens with-supertokens-app
```
