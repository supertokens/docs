---
id: to-st
title: Migrating to SuperTokens
hide_title: true
---

# Migrating to SuperTokens

## If you are using sessions
- **If you are OK with logging all users out**:
   - This can be solved by replacing your session creation, verification and revocation calls with the ones from SuperTokens. Since SuperTokens' session verification is most likely going to be different, verification of existing session will most likely fail, logging out that user. Then when they log back in, they will be using SuperTokens session system.

- **If you want to keep all existing users logged in**:
   - For this approach, you should change the session verification, creation and revocation for all your APIs, excepting for one. This one API will be a new API whose job is to verify a session created from your system, revoke it, and create a new session using SuperTokens.
   - For all users, on first page load, if your session exists (and not SuperTokens' session), you want to call this special API, wait for it to switch sessions, and then continue with the rest of the app load.
## If you are using login
This depends a lot on the existing solution you are using. We are hard at work writing these docs... 🖊️⌛. In the meantime, you can ask us questions on [our Discord](https://supertokens.io/discord)

[comment]: <> (TODO:)
[comment]: <> (Custom)
[comment]: <> (Auth0)
[comment]: <> (Cognito)
[comment]: <> (Okta)