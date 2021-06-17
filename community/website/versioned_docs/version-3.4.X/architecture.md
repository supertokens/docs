---
id: version-3.4.X-architecture
title: Architecture & Java
hide_title: true
original_id: architecture
---

# Application architecture

There are three components to SuperTokens:
- **Frontend SDK**: Responsible for rendering the login UI widgets and managing session tokens automatically.
- **Backend SDK**: Provides APIs for sign-up, sign-in, signout, session refreshing.. which the frontend widgets talk to.
- **SuperTokens Core**: This is a Java HTTP service that contains the core logic for auth. It's responsible for interfacing with the database and is used by the SuperTokens backend SDK for operations that require the db.

## Diagram example
Below is an example of how the three components interact for sign in and sign out flow (with email and password):

<!--DOCUSAURUS_CODE_TABS-->
<!--Managed service-->

<img src="/docs/static/assets/community/architecture/managed_service.png" />

<!--Self hosted-->

<img src="/docs/static/assets/community/architecture/self_hosted.png" />

<!--END_DOCUSAURUS_CODE_TABS-->

> You do NOT need to know how to code in Java, nor do you have to be using Java to use SuperTokens in your application. Java is used for the SuperTokens core which is a http microservice that your backend talks to.