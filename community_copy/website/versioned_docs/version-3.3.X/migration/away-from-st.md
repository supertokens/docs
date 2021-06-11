---
id: version-3.3.X-away-from-st
title: Migrating away from SuperTokens
hide_title: true
original_id: away-from-st
---

# Migrating away from SuperTokens

## If you are using login
- **If you are self hosting it**:
   - In the database, the users table contains important information like the userId, their email and their password hash. The password hash is created using a standard `bcrypt` algorithm with the number of rounds embedded in the hash itself. So it should not be a problem to verify / change them yourself.
   - The password reset tokens in the database is a hash of the actual token sent via the email, so you could continue to verify the existing tokens if any.
   - In case you are moving to another service that provides authentication, then you will need to follow their migration guide. From their point of view, it's as if you are using an in house auth system (since you control the data and we are open source).

- **If you are using our managed service**:
   - The points highlighted above apply here as well.
   - Please [contact us](mailto:team@supertokens.io) so that we can verify your identity and give you access to the database instance (PostgreSQL) we use to run your SuperTokens setup.

## If you are using sessions
- **If you are OK with logging all users out**:
   - This can be solved by replacing the session creation, verification and revocation calls with your own solution. Since your session verification is most likely going to be different, verification of SuperTokens session will most likely fail, logging out that user. Then when they log back in, they will be using your session system.
   - That being said, we use `RS256` for JWT verification and the public / private keys for the JWT (access token) are present in the `key_value` table in the database.

- **If you want to keep all existing users logged in**:
   - For this approach, you should change session verification, creation and revocation for all your APIs, excepting for one. This one API will be a new API whose job is to verify a SuperTokens session, revoke it, and create a new session using your system
   - For all users, on first page load, if a SuperTokens session exists, you want to call this special API, wait for it to switch sessions, and then continue with the rest of the app load.