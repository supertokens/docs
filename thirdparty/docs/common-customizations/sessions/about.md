---
id: about
title: About
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./thirdpartyemailpassword/docs/common-customizations/sessions/about.md -->

# Session management

> If you have completed the Quick setup, you have already setup session management within your application.

SuperTokens provides a very secure session management out of the box. We prevent many session attack vectors like:
- XSS (by using `httpOnly` cookies)
- Minimises damage from JWT signing key compromise.
- Minimises damage from session data theft from database.
- Reliable detecting of session hijacking.
- CSRF attacks
- Brute force attacks
- Session fixation

## Overview of session flow ✨
<img src="/docs/static/assets/session_flow.png" />

- After sign in, a new session is created by issuing a refresh and access token to the frontend.
- The frontend sends the access token for each API call that requires session authentication.
- These API calls verify the access token and its expiry. If verification fails, the API throws a session expired error, else, execution continues.
- If an API throws session expired error, the frontend uses its refresh token to get a new refresh and a new access token. This is done via a special API on your backend. If a session has been revoked, this API will also throw session expired after which the user will have to login again.
- After obtaining a new set of tokens, the frontend retries the original API call, yielding the desired result.
- To revoke a session, the backend removes the refresh token and its session information from its database.
