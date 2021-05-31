---
id: introduction
title: Introduction
hide_title: true
---

# Introduction

## We offer the following functionality:
- ✅ Sign-up / Sign-in with email ID and password
- ✅ Forgot password flow using email
- ✅ Secure session management
- ✅ Email verification
- ✅ Social logins (Google, Facebook, Apple, Github + adding custom providers)

## Application Architecture 🏰
<img src="/docs/static/assets/emailpassword/architecture.png" />

- **Frontend SDK**: Responsible for rendering the login UI widgets and managing session tokens automatically.
- **Backend SDK**: Provides APIs for sign-up, sign-in, signout, session refreshing etc. These are called by the frontend UI.
- **SuperTokens Core**: This is an HTTP service that contains the core logic for auth and sessions (theses are used by the backend SDK in its APIs). It's also responsible for interfacing with the database. We have one instance of the Core running on [`https://try.supertokens.io`](https://try.supertokens.io/hello).


# Supported tech stacks 🙌
We integrate with your frontend, backend API and database.

- **NodeJS + ReactJS**: We support login + session management. Head over to the [Getting Started page](/docs/community/recipes)
- **NodeJS + Vanilla JS**: We support session management only. Head over to the [Session Management docs](/docs/session/introduction)
- For any other tech stack combination, please visit the [older docs](/docs/community/2.5.X/getting-started/installation).
