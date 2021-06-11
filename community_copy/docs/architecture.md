---
title: Architecture & Java
---

# Application architecture

## Application Architecture 🏰
<img src="/docs/static/assets/emailpassword/architecture.png" />

- **Frontend SDK**: Responsible for rendering the login UI widgets and managing session tokens automatically.
- **Backend SDK**: Provides APIs for sign-up, sign-in, signout, session refreshing etc. You can also disable these default APIs and build your own using the provided functions from this SDK.
- **SuperTokens Core**: This is an HTTP service that contains the core logic for auth and sessions. It's also responsible for interfacing with the database. We have one instance of the Core running on [`https://try.supertokens.io`](https://try.supertokens.io/hello).

## Why we chose Java for the SuperTokens core

> You do not need to know Java in order to use SuperTokens.

- ✅ Whilst running Java can seem difficult, we provide the JDK along with the binary / docker image when distributing it. This makes running SuperTokens just like running any other http microservice.
- ✅ Java has a very mature ecosystem. This implies that third party libraries have been battled tested.
- ✅ Java's strong type system ensures fewer bugs and easier maintainability. This is especially important when many people are expected to work on the same project.
- ✅ Our team is most comfortable with Java and hiring for great Java developers is relatively easy as well.