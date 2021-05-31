---
id: version-2.3.X-prologue
title: Prologue
hide_title: true
original_id: prologue
---

# SuperTokens

SuperTokens is an end-to-end and secure session management solution for web and mobile apps. At its core, SuperTokens uses rotating refresh tokens along with short lived access tokens to provide optimal security as well as user experience. The concept of rotating refresh tokens is explained [here](https://supertokens.io/blog/the-best-way-to-securely-manage-user-sessions?s=d).

## Overview of session flow
<img src="/docs/static/assets/session_flow.png" />

- A new session is created by issuing a refresh and access token to the frontend.
- The frontend sends the access token for each API call that requires session authentication.
- These API calls verify the access token and its expiry (amongst other things). If verification fails, the API throws a session expired error, else, execution continues.
- If an API throws session expired error, the frontend uses its refresh token to get a new refresh and a new access token. This is done via a special API on your backend. If a session has been revoked, this API will also throw session expired after which the user will have to login again.
- After obtaining a new set of tokens, the frontend retries the original API call, yielding the desired result.
- To revoke a session, the backend removes the refresh token and its session information from its database.

## Integration with SuperTokens
To provide maximum ease of implementation of the above session flow, you will have to integrate with these modules of SuperTokens:
- **Frontend SDK**: These help in automatically refreshing sessions in case of access token expiry.
- **The driver**: This is backend SDK (for Node, Django etc) that provides an easy way for you to accept session tokens from your frontend and use them to do various session related tasks. It also transparently communicates with the SuperTokens http service whenever needed.
- **SuperTokens core**: This is an http service that contains the main session logic and is responsible to communicate with your chosen database. You need to install and run this on your servers. You will also need to pick a database **plugin** (for MySQL, MongoDB etc) for this service to use.

#### An example setup with a specific tech stack is shown below:
<img src="/docs/static/assets/arch.png" />

<div class="divider"></div>

### Below is the list of all attacks that SuperTokens prevents / detects:
- XSS
- Minimises damage from JWT signing key compromise 
- Minimises damage from session data theft from database
- Reliable detecting of session hijacking
- CSRF (Can be optionally disabled system wide or on a per API basis)
- Brute force attacks
- Session fixation